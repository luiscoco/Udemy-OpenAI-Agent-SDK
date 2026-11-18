import importlib.util
import inspect
import json
from importlib.metadata import version
from agents.extensions.experimental.hosted_multi_agent import HostedMultiAgentConfig, OpenAIHostedMultiAgentModel
from agents.extensions.experimental.codex import codex_tool

print(json.dumps({"pythonAgentsVersion":version("openai-agents"),"hostedMultiAgent":{"class":OpenAIHostedMultiAgentModel.__name__,"signature":str(inspect.signature(OpenAIHostedMultiAgentModel)),"concurrencyConfig":HostedMultiAgentConfig(max_concurrent_subagents=2).max_concurrent_subagents,"availability":"Experimental integration installed. Remote access requires an account-side run."},"codexToolInstalled":callable(codex_tool),"liteLLMDependencyInstalled":importlib.util.find_spec("litellm") is not None,"anyLLMDependencyInstalled":importlib.util.find_spec("any_llm") is not None}))
