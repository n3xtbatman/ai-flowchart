import React from "react";

const categories = [
  {
    id: "creative",
    name: "Creative",
    emoji: "🎨",
    examples: "Image, Video, Music, Design"
  },
  {
    id: "interactive",
    name: "Interactive",
    emoji: "🎮",
    examples: "Games, Chatbots, Simulations"
  },
  {
    id: "development",
    name: "Development",
    emoji: "💻",
    examples: "Apps, Platforms, APIs"
  },
  {
    id: "workflows",
    name: "Workflows",
    emoji: "⚙️",
    examples: "Agents, Automation, Toolchains"
  },
  {
    id: "productivity",
    name: "Productivity",
    emoji: "🖋️",
    examples: "Writing, Meetings, Research"
  },
  {
    id: "research",
    name: "Research",
    emoji: "🔬",
    examples: "Science, Literature, Review"
  }
];

export default function HomePrompt({
  input,
  setInput,
  onGenerate,
  onReload,
  activeBuckets = []
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onGenerate();
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-4">
        What are you building?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {categories.map((cat) => {
          const active = activeBuckets.includes(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => setInput(cat.name.toLowerCase())}
              className={`cursor-pointer p-2 sm:p-4 rounded-lg shadow text-center border-2 transition text-sm sm:text-base ${
                active
                  ? "bg-green-100 border-green-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-1">{cat.emoji}</div>
              <div className="font-semibold text-md sm:text-lg">
                {cat.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {cat.examples}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mb-4 flex-wrap gap-2">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="e.g. I want to build a 3D multiplayer game"
        />
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={onGenerate}
        >
          Generate
        </button>
        <button
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          onClick={onReload}
        >
          Reload Site
        </button>
      </div>
    </>
  );
}
