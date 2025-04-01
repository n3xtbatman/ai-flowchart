import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

import { renderFlowchartFromAnswers } from "./RenderFlowchartFromAnswers";
import Questionnaire from "./components/Questionnaire";
import HomePrompt from "./components/HomePrompt";

const AIDB_URL =
  "https://raw.githubusercontent.com/n3xtbatman/ai-flowchart/main/data/AIDB.json?cache=" +
  Date.now();

export default function App() {
  const [tools, setTools] = useState({});
  const [schema, setSchema] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    fetch(AIDB_URL)
      .then((res) => res.json())
      .then(setTools);
  }, []);

  const handleBucketSelect = (bucketId) => {
    const schemaPath = `/src/schema/${bucketId}.json`;
    import(/* @vite-ignore */ schemaPath).then((mod) => {
      setSchema(mod.default);
      setShowPrompt(false);
    });
  };

  const handleQuestionnaireComplete = (answers) => {
    const { nodes, edges, stepList } = renderFlowchartFromAnswers(answers, tools);
    setNodes(nodes);
    setEdges(edges);
    document.getElementById("stepDescriptions").innerHTML = stepList
      .map((s) => `<p class='step-description'>${s}</p>`) 
      .join("");
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="p-6 max-w-screen-xl mx-auto">
        {showPrompt ? (
          <HomePrompt onSelect={handleBucketSelect} />
        ) : schema ? (
          <Questionnaire schema={schema} onComplete={handleQuestionnaireComplete} />
        ) : null}

        <div id="stepDescriptions" className="my-4 text-sm text-gray-700 space-y-4"></div>

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
              ),
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}