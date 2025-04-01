// This function receives questionnaire answers and builds categories
// like "3D asset tools", "Audio - Music", etc. based on answers

export function renderFlowchartFromAnswers(answers, allTools) {
  const nodes = [];
  const edges = [];
  const stepList = [];

  let x = 0;

  const addTool = (label, matchFn) => {
    const stageId = `stage-${label.toLowerCase().replace(/\s+/g, '-')}`;
    nodes.push({
      id: stageId,
      type: "default",
      position: { x: x * 300, y: 50 },
      data: { label: label },
    });

    let y = 130;
    const matched = Object.entries(allTools).filter(([name, data]) => matchFn(data));
    matched.forEach(([name, tool], j) => {
      const id = `${stageId}-tool-${j}`;
      nodes.push({
        id,
        type: tool["Primary?"] ? "primary" : "alt",
        position: { x: x * 300, y: y + j * 80 },
        data: {
          label: `<a href='${tool.Website}' target='_blank'><strong>${name}</strong></a><br/><small>${tool["Function / Use"]}</small>`
        },
      });
      edges.push({ id: `e-${stageId}-${id}`, source: stageId, target: id });
      if (tool["Function / Use"] && tool.Description) {
        stepList.push(`➡️ <strong>${name}</strong>: ${tool["Function / Use"]} — ${tool.Description}`);
      }
    });

    x++;
  };

  // Example logic based on schema answers
  if (answers.dimension === "3D") {
    addTool("3D Assets", tool => tool.Category === "3d modeling");
  } else if (answers.dimension === "2D") {
    addTool("2D Assets", tool => tool.Category === "image generation");
  }

  if (answers.audio?.includes("Voice")) {
    addTool("Audio - Voice", tool => tool.Subcategory === "voice");
  }

  if (answers.audio?.includes("Music")) {
    addTool("Audio - Music", tool => tool.Subcategory === "music");
  }

  if (answers.multiplayer === "Yes") {
    addTool("Multiplayer Services", tool => tool.Tags?.includes("multiplayer"));
  }

  return { nodes, edges, stepList };
}
