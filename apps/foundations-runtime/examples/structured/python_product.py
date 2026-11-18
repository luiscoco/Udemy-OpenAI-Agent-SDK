import asyncio
import json
import os
import sys
from pydantic import BaseModel, ValidationError
from agents import Agent, Runner, RunConfig
from agents.models.interface import Model
from agents.items import ModelResponse
from agents.usage import Usage
from openai.types.responses import ResponseOutputMessage, ResponseOutputText


class Product(BaseModel):
    name: str
    price: float


CASES = {
    "valid": {"name": "Classroom mug", "price": 12.5},
    "missing-field": {"price": 12.5},
    "wrong-type": {"name": "Classroom mug", "price": "twelve"},
    "numeric-string": {"name": "Classroom mug", "price": "12.50"},
}


class ClassroomModel(Model):
    def __init__(self, candidate):
        self.candidate = candidate
        self.calls = 0

    async def get_response(self, *args, **kwargs):
        self.calls += 1
        return ModelResponse(
            output=[ResponseOutputMessage(
                id="msg_classroom", type="message", role="assistant", status="completed",
                content=[ResponseOutputText(type="output_text", text=json.dumps(self.candidate), annotations=[])],
            )],
            usage=Usage(), response_id="classroom-python-response",
        )

    async def stream_response(self, *args, **kwargs):
        raise RuntimeError("The classroom example uses non-streaming runs.")
        yield  # Makes this the async iterator required by the Model interface.


async def main():
    scenario = sys.argv[1] if len(sys.argv) > 1 else "valid"
    live = len(sys.argv) > 2 and sys.argv[2] == "live"
    if scenario not in CASES:
        raise ValueError("Choose a listed product scenario.")
    if live and not os.environ.get("OPENAI_API_KEY", "").strip():
        raise RuntimeError("Set OPENAI_API_KEY before live execution.")
    candidate = CASES[scenario]
    local_model = ClassroomModel(candidate)
    agent = Agent(
        name="Python product extractor",
        instructions="Extract the product faithfully using the configured schema.",
        model=os.environ.get("OPENAI_MODEL", "gpt-6-astra") if live else local_model,
        output_type=Product,
    )
    try:
        result = await Runner.run(
            agent, "Extract this product: " + json.dumps(candidate),
            max_turns=3, run_config=RunConfig(tracing_disabled=True),
        )
        if not isinstance(result.final_output, Product) or result.interruptions:
            raise RuntimeError("The run returned no complete Product object.")
        report = {"accepted": True, "value": result.final_output.model_dump(), "pythonType": type(result.final_output).__name__}
    except Exception as error:
        if live:
            raise
        issues = []
        try:
            # The installed SDK's strict output schema validates with strict=True.
            Product.model_validate(candidate, strict=True)
        except ValidationError as validation:
            issues = [{"path": ".".join(map(str, item["loc"])), "type": item["type"]} for item in validation.errors()]
        if not issues:
            raise
        report = {"accepted": False, "errorType": type(error).__name__, "issues": issues}
    report.update({"candidate": candidate, "scriptedModel": not live, "localModelCalls": local_model.calls, "sdkStrictValidation": True, "schema": Product.model_json_schema()})
    print(json.dumps(report, ensure_ascii=True))


if __name__ == "__main__":
    asyncio.run(main())
