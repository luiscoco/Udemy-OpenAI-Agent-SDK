export const workshopInstant = "2026-11-12T17:00:00Z";

export function personalize(context) {
  const { language, timezone, detail } = context.preferences;
  const locale = language === "Spanish" ? "es-ES" : "en-GB";
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(workshopInstant));
  return {
    time,
    instructions: `Reply in ${language} with ${detail} detail. The robotics workshop begins at ${time} in timezone ${timezone}. Explain when to attend and what an AI agent is.`,
  };
}
