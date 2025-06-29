const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface SubtaskRequest {
  mainTask: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { mainTask }: SubtaskRequest = await req.json();

    if (!mainTask || mainTask.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Main task is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are a helpful executive assistant. Given a main task, break it down into sub tasks. You should follow a generic sub task list which is applicable for booking a flight, ordering groceries (here you may check the smart basket or a to do list). Return them in a plain JSON array. Do not include any extra tasks or explanations. Here is an example: MAIN task (such as book a movie show). Sub tasks - identify which theatre it is playing at, what are the show timings, which is theatre closest to me and reserve the seat and make a payment using preferred credit/card UPI)."
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: mainTask
              }
            ]
          }
        ],
        response_format: {
          type: "text"
        },
        temperature: 1,
        max_completion_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate subtasks" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const subtasksText = openaiData.choices[0]?.message?.content;

    if (!subtasksText) {
      return new Response(
        JSON.stringify({ error: "No subtasks generated" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the JSON array from the response
    let subtasks: string[] = [];
    try {
      subtasks = JSON.parse(subtasksText);
      
      // Ensure it's an array of strings
      if (!Array.isArray(subtasks)) {
        throw new Error("Response is not an array");
      }
      
      subtasks = subtasks.filter(task => typeof task === 'string' && task.trim().length > 0);
    } catch (parseError) {
      console.error("Failed to parse subtasks:", parseError);
      // Fallback: try to extract tasks from text
      const lines = subtasksText.split('\n').filter(line => line.trim().length > 0);
      subtasks = lines.map(line => line.replace(/^[-*•]\s*/, '').trim()).filter(task => task.length > 0);
    }

    return new Response(
      JSON.stringify({ subtasks }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in generate-subtasks function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});