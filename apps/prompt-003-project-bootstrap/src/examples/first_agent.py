import asyncio
import os
import sys
from agents import Agent, Runner

async def main():
    if not os.environ.get("OPENAI_API_KEY", "").strip():
        raise RuntimeError("Set OPENAI_API_KEY in your server environment.")

    tutor = Agent(
        name="Classroom tutor",
        model=os.environ.get("OPENAI_MODEL", "gpt-6-astra"),
        instructions="Explain the requested concept to a beginner in two short sentences.",
    )
    question = " ".join(sys.argv[1:]) or "What is an AI agent?"
    result = await Runner.run(tutor, question, max_turns=3)
    if result.final_output is None:
        raise RuntimeError("The run returned no final answer.")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
