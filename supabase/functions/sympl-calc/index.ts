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

    // Sympl interest rates (approximate - actual rates vary by customer)
    const interestRates: Record<number, number> = {
      3: 0.04,   // 4% for 3 months
      6: 0.07,   // 7% for 6 months
      9: 0.11,   // 11% for 9 months
      12: 0.14,  // 14% for 12 months
      18: 0.20,  // 20% for 18 months
      24: 0.26,  // 26% for 24 months
    };

    const rate = interestRates[tenure] || 0.14;
    const totalProfit = price * rate;
    const totalAmount = price + totalProfit;
    const monthly = Math.round(totalAmount / tenure);

    console.log(`Sympl calculation: price=${price}, tenure=${tenure}, monthly=${monthly}`);

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
    console.error('Error in sympl-calc:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
