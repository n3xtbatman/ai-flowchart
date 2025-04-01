// This logic supports omni-directional schema stacking
// e.g. audio → visuals, interactive → audio, etc.

import visualsSchema from "../schema/visuals.json";
import audioSchema from "../schema/audio.json";
import interactiveSchema from "../schema/interactive.json";

export function getStackedSchemas(prompt) {
  const schemas = [];
  const promptLower = prompt.toLowerCase();

  if (promptLower.includes("video") || promptLower.includes("visual")) schemas.push(visualsSchema);
  if (promptLower.includes("audio") || promptLower.includes("music") || promptLower.includes("voiceover")) schemas.push(audioSchema);
  if (promptLower.includes("game") || promptLower.includes("interactive") || promptLower.includes("play")) schemas.push(interactiveSchema);

  return schemas;
}

export function mergeSchemas(schemas) {
  return {
    title: "Combined Questionnaire",
    questions: schemas.flatMap(schema => schema.questions)
  };
}