import { lookupActivity } from "../tools/club.mjs";

export function createClubAgent({ Agent, tool, z, model, onTool }) {
  const lookup = tool({
    name: "lookup_activity",
    description: "Read the school club timetable for the requested activity.",
    parameters: z.object({
      activity: z.enum(["robotics", "astronomy", "music"]),
    }),
    execute: async ({ activity }) => {
      const data = lookupActivity(activity);
      onTool(data);
      return data;
    },
  });

  return new Agent({
    name: "Club assistant",
    model,
    instructions:
      "Use lookup_activity for the requested club. Report only the timetable data it returns. Answer briefly.",
    tools: [lookup],
    modelSettings: { parallelToolCalls: false },
  });
}
