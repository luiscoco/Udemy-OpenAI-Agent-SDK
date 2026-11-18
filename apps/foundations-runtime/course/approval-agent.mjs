import { sdk, z, scriptedModel, message, functionCall } from "./common.mjs";

export function createApprovalAgent(
  store,
  {
    tenant,
    operationId,
    amount = 50,
    conditional = false,
    phase = "initial",
    multiple = false,
  } = {},
) {
  const effects = [];
  const tool = sdk.tool({
    name: "update_record",
    description:
      "Update a synthetic classroom record after authorization and approval.",
    parameters: z.object({
      recordId: z.string(),
      amount: z.number().positive(),
    }),
    needsApproval: conditional ? (_context, args) => args.amount > 100 : true,
    errorFunction: () => "ACTION_FORBIDDEN",
    execute: (args) => {
      if (!store.authorized(tenant))
        throw new Error("Current permission denied.");
      const receipt = store.effect(
        tenant,
        `${operationId}:${args.recordId}`,
        args,
      );
      effects.push(receipt);
      return receipt;
    },
  });
  const calls = [
    functionCall("update_record", { recordId: "record-1", amount }),
  ];
  if (multiple)
    calls.push(
      functionCall(
        "update_record",
        { recordId: "record-2", amount },
        "update-2",
      ),
    );
  const model = scriptedModel(
    phase === "resume"
      ? [message("The reviewed record actions have settled.")]
      : [calls, message("The reviewed record actions have settled.")],
  );
  return {
    agent: new sdk.Agent({ name: "Record reviewer", model, tools: [tool] }),
    effects,
    tool,
  };
}
