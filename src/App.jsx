import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import HomePrompt from "./components/HomePrompt";
import flows from "./data/flows.json";
import { generateFlowsFromPrompt } from "./utils/generateFlowsFromPrompt";

const AIDB_URL =
  "https://raw.githubusercontent.com/n3xtbatman/ai-flowchart/main/public/data/AIDB.json?cache=" +
  Date.now();

const CATEGORY_KEYWORDS = {
  creative: ["image", "video", "music", "design", "visual", "art"],
  interactive: ["game", "games", "chatbot", "simulation", "interactive"],
  development: ["app", "platform", "api", "tool", "code", "development"],
  workflows: ["agent", "automation", "toolchain", "workflow"],
  productivity: ["writing", "meeting", "note", "task", "organize"],
  research: ["science", "literature", "review", "paper", "study"]
};

export default function App() {
  const [tools, setTools] = useState({});
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [input, setInput] = useState("");
  const [activeBuckets, setActiveBuckets] = useState([]);
  const [filtered, setFiltered] = useState(false);

  useEffect(() => {
    fetch(AIDB_URL)
      .then((res) => res.json())
      .then(setTools);
  }, []);

  useEffect(() => {
    if (!input) {
      setActiveBuckets([]);
      setFiltered(false);
      renderAllNodes();
      return;
    }

    const lower = input.toLowerCase();
    const buckets = Object.entries(CATEGORY_KEYWORDS)
      .filter(([_, list]) => list.some((w) => lower.includes(w)))
      .map(([key]) => key);

    setActiveBuckets(buckets);
    renderMatchingNodes(lower);
  }, [input]);

  const handleGenerate = () => {
    setFiltered(true);
    const lower = input.toLowerCase();
    const flowsMatched = generateFlowsFromPrompt(lower, false, tools);

    if (flowsMatched.length) {
      const flow = flowsMatched[0];
      const flowNodes = flow.steps.map((step, i) => ({
        id: step.tool,
        position: { x: i * 250, y: 100 },
        data: {
          label: `<strong>${step.tool}</strong><br/><small>${step.function}</small>`
        },
        type: "primary"
      }));

      const flowEdges = flow.steps
        .slice(1)
        .map((step, i) => ({
          id: `e-${i}`,
          source: flow.steps[i].tool,
          target: step.tool
        }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } else {
      // fallback to filtered tools by category
      const list = Object.entries(tools).filter(([_, t]) =>
        activeBuckets.includes(t.Category?.toLowerCase())
      );

      const n = list.map(([tool, t], i) => ({
        id: tool,
        position: { x: (i % 5) * 250, y: Math.floor(i / 5) * 180 },
        data: {
          label: `<strong>${tool}</strong><br/><small>${t["Function / Use"]}</small>`
        },
        type: "primary"
      }));

      setNodes(n);
      setEdges([]);
    }
  };

  const renderAllNodes = () => {
    const all = Object.entries(tools).map(([tool, data], i) => ({
      id: tool,
      position: { x: (i % 5) * 250, y: Math.floor(i / 5) * 180 },
      data: {
        label: `<strong>${tool}</strong><br/><small>${data["Function / Use"]}</small>`
      },
      type: "alt"
    }));
    setNodes(all);
    setEdges([]);
  };

  const renderMatchingNodes = (inputLower) => {
    const all = Object.entries(tools).map(([tool, data], i) => {
      const label = `<strong>${tool}</strong><br/><small>${data["Function / Use"]}</small>`;
      const lowerTool = tool.toLowerCase();
      const lowerCat = (data.Category || "").toLowerCase();
      const lowerSub = (data.Subcategory || "").toLowerCase();

      const match =
        lowerTool.includes(inputLower) ||
        lowerCat.includes(inputLower) ||
        lowerSub.includes(inputLower) ||
        inputLower.includes(lowerTool) ||
        inputLower.includes(lowerCat) ||
        inputLower.includes(lowerSub) ||
        inputLower.split(" ").some(
          (w) =>
            lowerTool.includes(w) ||
            lowerCat.includes(w) ||
            lowerSub.includes(w)
        );

      return {
        id: tool,
        position: { x: (i % 5) * 250, y: Math.floor(i / 5) * 180 },
        data: { label },
        type: match ? "primary" : "alt"
      };
    });

    setNodes(all);
    setEdges([]);
  };

  const handleReload = () => {
    setInput("");
    setFiltered(false);
    renderAllNodes();
  };

  useEffect(() => {
    if (Object.keys(tools).length && !input) renderAllNodes();
  }, [tools]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <HomePrompt
        input={input}
        setInput={setInput}
        onGenerate={handleGenerate}
        activeBuckets={activeBuckets}
        onReload={handleReload}
      />
      <div className="w-full h-[75vh] border rounded">
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
            )
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
