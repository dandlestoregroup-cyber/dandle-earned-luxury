import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { price, tenure } = await req.json();

    if (!price || !tenure) {
      return new Response(
        JSON.stringify({ error: 'Missing price or tenure' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // valU interest rates (approximate - actual rates vary by customer)
    const interestRates: Record<number, number> = {
      3: 0.05,   // 5% for 3 months
      6: 0.08,   // 8% for 6 months
      9: 0.12,   // 12% for 9 months
      12: 0.15,  // 15% for 12 months
      18: 0.22,  // 22% for 18 months
      24: 0.28,  // 28% for 24 months
    };

    const rate = interestRates[tenure] || 0.15;
    const totalProfit = price * rate;
    const totalAmount = price + totalProfit;
    const monthly = Math.round(totalAmount / tenure);

    console.log(`valU calculation: price=${price}, tenure=${tenure}, monthly=${monthly}`);

    return new Response(
      JSON.stringify({
        monthly,
        totalProfit: Math.round(totalProfit),
        totalAmount: Math.round(totalAmount),
        tenureOptions: [3, 6, 9, 12, 18, 24]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in valu-calc:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
