import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { loadTypescript } from './helpers/load-typescript.mjs';
const { GET, POST } = await loadTypescript('api/nour-render.ts');
const photo = `data:image/jpeg;base64,${(await readFile('public/images/easyup-beige-front.jpg')).toString('base64')}`;
const jpeg = photo.split(',')[1];
const valid = { modelId: 'easyup', finishId: 'reference', roomImage: photo, roomAspect: 1.5, placement: 'Empty corner beside the window', photoConsent: true };
const request = (body = valid, headers = {}) => new Request('https://dandle.test/api/nour/v1/visualizations', { method:'POST', headers:{'Content-Type':'application/json','Idempotency-Key':'02d07372-5834-4b06-b0bc-160e61a039bf', ...headers}, body:JSON.stringify(body) });

function setup(t, { enabled = true, reservation = 1, providerStatus = 200, qa = true, qaStatus = 200 } = {}) {
  const original = { ...process.env };
  process.env.NOUR_I2I_ENABLED = String(enabled);
  process.env.OPENAI_API_KEY = 'test-key-never-sent';
  process.env.NOUR_I2I_REDIS_URL = 'https://redis.test';
  process.env.NOUR_I2I_REDIS_TOKEN = 'test-guard-token';
  delete process.env.NOUR_I2I_PUBLIC_ORIGIN;
  delete process.env.NOUR_I2I_DAILY_LIMIT;
  delete process.env.VERCEL;
  t.after(() => { for (const key of Object.keys(process.env)) if (!(key in original)) delete process.env[key]; Object.assign(process.env, original); });
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options = {}) => {
    calls.push({url:String(url), options});
    if (String(url).startsWith('https://dandle.test/images/')) return new Response(Buffer.from(jpeg,'base64'), {headers:{'Content-Type':'image/jpeg'}});
    if (String(url) === 'https://redis.test') return Response.json({result:reservation});
    if (String(url).endsWith('/images/edits')) return Response.json(providerStatus === 200 ? {data:[{b64_json:jpeg}]} : {error:'PRIVATE PROVIDER DETAIL'}, {status:providerStatus});
    if (String(url).endsWith('/responses')) return Response.json({output_text:JSON.stringify({pass:qa})}, {status:qaStatus});
    throw new Error('Unexpected network target: '+url);
  });
  return calls;
}

test('catalogue exposes only existing approved references and positive server prices', async t => {
  setup(t);
  const response = await GET(); const data = await response.json();
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(data.products.length, 6);
  for (const p of data.products) { assert.ok(p.startingPrice === null || (Number.isFinite(p.startingPrice) && p.startingPrice > 0)); for (const f of p.finishes) await access('public'+f.image); }
  assert.equal(data.products.find(p=>p.id==='easyup').startingPrice,35000);
});

test('disabled generation fails closed with zero outbound calls', async t => {
  const calls=setup(t,{enabled:false});
  const response=await POST(request()); assert.equal(response.status,503); assert.equal(calls.length,0);
});

test('untrusted products, invented finishes, false consent and malformed photos never reach the provider', async t => {
  const calls=setup(t);
  for (const change of [{modelId:'worknest'},{modelId:'__proto__'},{finishId:'invented-blue'},{colour:'Blue'},{modelName:'Different chair'},{photoConsent:false},{roomImage:'data:image/jpeg;base64,aW52YWxpZA=='},{roomAspect:Infinity},{placement:42}]) {
    const response=await POST(request({...valid,...change})); assert.ok(response.status>=400,JSON.stringify(change));
  }
  assert.equal(calls.length,0);
});

test('malformed JSON, foreign browser origin and oversized bodies fail before spending',async t=>{
  const calls=setup(t);
  assert.equal((await POST(request(valid,{Origin:'https://other.test'}))).status,403);
  assert.equal((await POST(new Request('https://dandle.test/api/nour-render',{method:'POST',headers:{'Content-Type':'application/json'},body:'{broken'}))).status,400);
  assert.equal((await POST(request({...valid,roomImage:'x'.repeat(2_810_000)}))).status,413);
  assert.equal(calls.length,0);
});

test('room and approved reference reach Sunburst once; QA must pass before release',async t=>{
  const calls=setup(t);
  const response=await POST(request()); const data=await response.json();
  assert.equal(response.status,200); assert.equal(data.visualQaPassed,true); assert.equal(data.fitVerified,false); assert.equal(data.commercialApproval,false);
  assert.equal(data.modelId,'easyup'); assert.equal(data.finishId,'reference'); assert.equal(data.imageModel,'gpt-image-2.5-sunburst');
  const edit=calls.find(c=>c.url.endsWith('/images/edits')).options.body;
  assert.equal(edit.get('model'),'gpt-image-2.5-sunburst'); assert.equal(edit.getAll('image[]').length,2);
  assert.match(edit.get('prompt'),/EasyUp Standard/); assert.match(edit.get('prompt'),/do not use Base44 or Lovable credits/);
  assert.equal(calls.filter(c=>c.url.endsWith('/images/edits')).length,1);
  const qa=JSON.parse(calls.find(c=>c.url.endsWith('/responses')).options.body); assert.equal(qa.store,false);
  const gate=JSON.parse(calls.find(c=>c.url==='https://redis.test').options.body); assert.equal(gate[0],'EVAL'); assert.ok(!JSON.stringify(gate).includes(photo.slice(0,60)));
});

test('QA rejection withholds the image without paying for a retry',async t=>{
  const calls=setup(t,{qa:false}); const response=await POST(request()); const data=await response.json();
  assert.equal(response.status,422); assert.equal(data.image,undefined); assert.equal(data.approved,false);
  assert.equal(calls.filter(c=>c.url.endsWith('/images/edits')).length,1);
});

test('QA outage withholds the image',async t=>{
  setup(t,{qaStatus:503}); const response=await POST(request()); assert.equal(response.status,502); assert.equal((await response.json()).image,undefined);
});

test('provider access errors never downgrade models or leak provider responses',async t=>{
  const calls=setup(t,{providerStatus:403}); const response=await POST(request()); const text=await response.text();
  assert.equal(response.status,502); assert.ok(!text.includes('PRIVATE PROVIDER DETAIL'));
  assert.equal(calls.filter(c=>c.url.includes('openai.com')).length,1);
});

for (const [reservation,status] of [[0,429],[2,409],[3,409],[null,503]]) test(`spend guard ${reservation} prevents generation`,async t=>{
  const calls=setup(t,{reservation}); assert.equal((await POST(request())).status,status);
  assert.equal(calls.filter(c=>c.url.includes('openai.com')).length,0);
});
