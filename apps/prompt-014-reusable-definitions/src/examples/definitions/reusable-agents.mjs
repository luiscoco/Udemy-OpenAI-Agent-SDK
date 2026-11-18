export function createTutorVariant({ Agent, model, variant }) {
  const base = new Agent({
    name: "AI tutor base",
    model,
    instructions: "Explain AI agent concepts to beginners.",
    tools: [],
  });
  const style =
    variant === "guided"
      ? "Use three short numbered teaching steps and finish with one question."
      : "Use two short sentences.";
  const specialized = base.clone({
    name: variant === "guided" ? "Guided AI tutor" : "Concise AI tutor",
    instructions: `${base.instructions}\n${style}`,
    tools: [],
  });
  return { base, specialized };
}
