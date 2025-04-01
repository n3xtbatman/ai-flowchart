import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const AIDB_URL =
  "https://raw.githubusercontent.com/n3xtbatman/aidb.dev/main/data/AIDB.json?cache=" +
  Date.now();

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const btn = document.getElementById("generateBtn");
    btn.onclick = () => {
      const input = document
        .getElementById("promptInput")
        .value.trim()
        .toLowerCase();
      setFilter(input);
    };
  }, []);

  useEffect(() => {
    if (filter !== "") renderFlowchart();
  }, [filter]);

  async function renderFlowchart() {
    const AIDB = await fetch(AIDB_URL).then((res) => res.json());
    const newNodes = [];
    const newEdges = [];
    const stepList = [];

    const grouped = {};
    for (const [tool, data] of Object.entries(AIDB)) {
      const key = `${data.Category}--${data.Subcategory}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ tool, ...data });
    }

    let xIndex = 0;
    Object.entries(grouped).forEach(([groupKey, tools]) => {
      const [category, subcategory] = groupKey.split("--");
      const matchesFilter =
        filter === "" ||
        category.toLowerCase().includes(filter) ||
        (subcategory && subcategory.toLowerCase().includes(filter)) ||
        tools.some((t) => t.tool.toLowerCase().includes(filter));

      if (!matchesFilter) return;

      const stageId = `stage-${groupKey}`;
      newNodes.push({
        id: stageId,
        type: "default",
        position: { x: xIndex * 300, y: 50 },
        data: { label: `${category.toUpperCase()} - ${subcategory}` },
      });

      tools.forEach((tool, j) => {
        const id = `${groupKey}-${tool.tool}`;
        newNodes.push({
          id,
          type: tool["Primary?"] ? "primary" : "alt",
          position: { x: xIndex * 300, y: 130 + 80 * j },
          data: {
            label: `<a href='${tool.Website}' target='_blank'><strong>${tool.tool}</strong></a><br/><small>${tool["Function / Use"]}</small>`,
          },
        });
        newEdges.push({ id: `e-${stageId}-${id}`, source: stageId, target: id });

        if (tool["Function / Use"] && tool.Description) {
          stepList.push(
            `➡️ <strong>${tool.tool}</strong>: ${tool["Function / Use"]} — ${tool.Description}`
          );
        }
      });

      xIndex++;
    });

    setNodes(newNodes);
    setEdges(newEdges);
    document.getElementById("stepDescriptions").innerHTML = stepList
      .map((s) => `<p class="step-description">${s}</p>`)
      .join("");
  }

  return (
    <div style={{ height: "80vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={{
          primary: ({ data }) => (
            <div
              className="react-flow__node-primary p-2 rounded text-sm text-center"
              dangerouslySetInnerHTML={{ __html: data.label }}
            />
          ),
          alt: ({ data }) => (
            <div
              className="react-flow__node-alt p-2 rounded text-sm text-center"
              dangerouslySetInnerHTML={{ __html: data.label }}
            />
          ),
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
