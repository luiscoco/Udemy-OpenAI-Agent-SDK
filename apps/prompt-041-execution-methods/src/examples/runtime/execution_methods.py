import asyncio
import json
import sys
import time
from agents import Agent, Runner, RunConfig
from agents.models.interface import Model
from agents.items import ModelResponse
from agents.usage import Usage
from openai.types.responses import ResponseOutputMessage, ResponseOutputText


class ClassroomModel(Model):
    async def get_response(self, *args, **kwargs):
        await asyncio.sleep(0)
        return ModelResponse(output=[ResponseOutputMessage(
            id="msg_methods", type="message", role="assistant", status="completed",
            content=[ResponseOutputText(type="output_text", text="Completed Python SDK execution.", annotations=[])],
        )], usage=Usage(), response_id="python-method-response")

    async def stream_response(self, *args, **kwargs):
        raise RuntimeError("This example uses complete-response execution.")
        yield


def main():
    method = sys.argv[1] if len(sys.argv) > 1 else "async-python"
    if method not in ["async-python", "sync-python"]:
        raise ValueError("Choose a listed Python method.")
    agent = Agent(name="Python execution tutor", model=ClassroomModel())
    config = RunConfig(tracing_disabled=True)
    started = time.perf_counter()
    if method == "sync-python":
        result = Runner.run_sync(agent, "Explain SDK execution.", run_config=config)
    else:
        result = asyncio.run(Runner.run(agent, "Explain SDK execution.", run_config=config))
    print(json.dumps({"method": method, "finalOutput": result.final_output,
                      "lastResponseId": result.last_response_id,
                      "elapsedSdkMs": round((time.perf_counter()-started)*1000, 3),
                      "scriptedInference": True}))


if __name__ == "__main__":
    main()
