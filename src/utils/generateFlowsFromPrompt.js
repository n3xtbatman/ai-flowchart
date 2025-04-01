export function generateFlowsFromPrompt(prompt, freeOnly, tools) {
    const lower = prompt.toLowerCase();
    const flows = [];
  
    const isFree = (toolName) => {
      const tool = tools[toolName];
      return tool && (!tool.PaidOnly || tool.Free === true);
    };
  
    const addFlow = (title, steps) => {
      const validSteps = steps.filter(({ tool }) =>
        tools[tool] && (!freeOnly || isFree(tool))
      );
      if (validSteps.length > 0) {
        flows.push({ title, steps: validSteps });
      }
    };
  
    if (
      lower.includes("song") ||
      lower.includes("music") ||
      lower.includes("audio")
    ) {
      addFlow("Song Creation", [
        { tool: "ChatGPT", function: "Generate lyrics" },
        { tool: "Soundraw", function: "Generate melody" }
      ]);
    }
  
    if (
      lower.includes("video") ||
      lower.includes("music video") ||
      lower.includes("visual")
    ) {
      addFlow("Music Video", [
        { tool: "Midjourney", function: "Create 2D images" },
        { tool: "Luma AI", function: "Feed images into Dream Machine" },
        { tool: "EditAI", function: "Edit final footage" }
      ]);
    }
  
    if (lower.includes("chatbot") || lower.includes("bot")) {
      addFlow("Chatbot Builder", [
        { tool: "ChatGPT", function: "Train on sample data" },
        { tool: "BotPress", function: "Deploy logic flows" }
      ]);
    }
  
    return flows;
  }
  