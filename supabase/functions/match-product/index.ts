import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { products } from "./products.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  product_url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Products are imported from products.ts
    console.log(`Loaded ${products.length} products for matching`);

    // Create product list for AI
    const productList = products.map(p => 
      `ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Price: $${p.price}`
    ).join('\n');

    // Call Lovable AI with vision
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a product matching AI. Analyze the uploaded product image and find the BEST matching product from this list:

${productList}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "best_match_id": <number>,
  "similarity_score": <number between 0.0 and 1.0>,
  "reason": "<brief explanation why this is the best match>"
}

Consider: visual appearance, product type, category, and features. Be strict with similarity scores.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      console.error('No AI response content');
      return new Response(
        JSON.stringify({ error: 'No match result from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Response:', aiContent);

    // Parse AI response (handle potential markdown code blocks)
    let matchData;
    try {
      const cleanedContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      matchData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent, parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the matched product
    const matchedProduct = products.find(p => p.id === matchData.best_match_id);

    if (!matchedProduct) {
      console.error('Product not found:', matchData.best_match_id);
      return new Response(
        JSON.stringify({ error: 'Matched product not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = {
      product: matchedProduct,
      similarity_score: matchData.similarity_score,
      reason: matchData.reason
    };

    console.log('Match result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in match-product function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});