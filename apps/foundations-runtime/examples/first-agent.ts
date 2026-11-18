import { Agent, run } from "@openai/agents";

if (!process.env.OPENAI_API_KEY?.trim()) {
  throw new Error("Set OPENAI_API_KEY in your server environment.");
}

const tutor = new Agent({
  name: "Classroom tutor",
  model: process.env.OPENAI_MODEL || "gpt-6-astra",
  instructions:
    "Explain the requested concept to a beginner in two short sentences.",
});

const question = process.argv.slice(2).join(" ") || "What is an AI agent?";
const result = await run(tutor, question, { maxTurns: 3 });
if (result.finalOutput === undefined)
  throw new Error("The run returned no final answer.");
console.log(result.finalOutput);
