import { useEffect, useState } from "react";

const keywordMap = {
  multiplayer: { id: "multiplayer", value: "Yes" },
  "no multiplayer": { id: "multiplayer", value: "No" },
};

export default function Questionnaire({ schema, onComplete, prefill }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const autoFilled = {};
    const lowerPrefill = prefill.toLowerCase();

    // Match schema-based options
    schema.questions.forEach((q) => {
      q.options.forEach((opt) => {
        const normalized = opt.toLowerCase();
        const pattern = new RegExp(`\\b${normalized}\\b`, "i");
        if (pattern.test(lowerPrefill)) {
          if (q.type === "multi") {
            autoFilled[q.id] = autoFilled[q.id] || [];
            if (!autoFilled[q.id].includes(opt)) {
              autoFilled[q.id].push(opt);
            }
          } else {
            autoFilled[q.id] = opt;
          }
        }
      });
    });

    // Match keyword aliases
    Object.entries(keywordMap).forEach(([key, { id, value }]) => {
      if (lowerPrefill.includes(key)) {
        if (schema.questions.find((q) => q.id === id)?.type === "multi") {
          autoFilled[id] = autoFilled[id] || [];
          if (!autoFilled[id].includes(value)) {
            autoFilled[id].push(value);
          }
        } else {
          autoFilled[id] = value;
        }
      }
    });

    setAnswers(autoFilled);
  }, [schema, prefill]);

  const handleChange = (id, value, type) => {
    if (type === "multi") {
      const current = answers[id] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [id]: updated });
    } else {
      setAnswers({ ...answers, [id]: value });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(answers);
  };

  if (!schema) return null;

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow mb-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{schema.title}</h2>

      {schema.questions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="font-medium mb-2">{q.question}</p>

          {q.options.map((opt) => (
            <label key={opt} className="block mb-1 cursor-pointer">
              <input
                type="checkbox"
                name={q.id}
                value={opt}
                checked={
                  q.type === "multi"
                    ? (answers[q.id] || []).includes(opt)
                    : answers[q.id] === opt
                }
                onChange={() => handleChange(q.id, opt, q.type)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}