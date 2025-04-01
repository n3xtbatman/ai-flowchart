// src/components/HomePrompt.jsx

import React from "react";

const bucketOptions = [
  {
    id: "creative",
    title: "Creative Media",
    emoji: "🎨",
    subtitle: "Image, Video, Music, Design",
  },
  {
    id: "interactive",
    title: "Interactive Apps",
    emoji: "🕹",
    subtitle: "Games, Chatbots, Simulations",
  },
  {
    id: "workflow",
    title: "Workflows & Agents",
    emoji: "⚙️",
    subtitle: "Automation, Toolchains, APIs",
  },
  {
    id: "productivity",
    title: "Productivity",
    emoji: "✍️",
    subtitle: "Writing, Meetings, Research",
  },
  {
    id: "dev",
    title: "Dev & Code",
    emoji: "💻",
    subtitle: "Programming Tools & Platforms",
  },
  {
    id: "research",
    title: "Research & Science",
    emoji: "🔬",
    subtitle: "Biotech, Chemistry, Academic AI",
  }
];

export default function HomePrompt({ onSelect }) {
  return (
    <div className="max-w-screen-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">What are you trying to build?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bucketOptions.map((bucket) => (
          <button
            key={bucket.id}
            onClick={() => onSelect(bucket.id)}
            className="bg-white hover:bg-blue-50 border border-gray-300 rounded-lg p-6 shadow-md text-left flex flex-col items-start transition"
          >
            <div className="text-4xl mb-2">{bucket.emoji}</div>
            <div className="text-lg font-semibold">{bucket.title}</div>
            <div className="text-sm text-gray-600">{bucket.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
