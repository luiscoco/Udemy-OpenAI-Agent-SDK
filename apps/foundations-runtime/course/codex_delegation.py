"""Optional live Codex integration, scoped to a newly created fixture repository."""
import asyncio
import json
import os
from pathlib import Path
from tempfile import mkdtemp
from agents.extensions.experimental.codex import Codex, ThreadOptions

async def main():
    parent=Path(__file__).resolve().parents[2]/".runtime"/"codex-tasks"
    parent.mkdir(parents=True,exist_ok=True)
    workspace=Path(mkdtemp(prefix="task-",dir=parent))
    target=workspace/"calculator.mjs"
    before="export const add = (a,b) => a - b;\n"
    target.write_text(before,encoding="utf8")
    codex=Codex(codex_path_override=os.environ.get("CODEX_PATH") or None)
    thread=codex.start_thread(ThreadOptions(working_directory=str(workspace),sandbox_mode="workspace-write",skip_git_repo_check=True,network_access_enabled=False,web_search_mode="disabled",approval_policy="never"))
    turn=await asyncio.wait_for(thread.run("Fix only calculator.mjs so add(2,3) returns 5. Preserve its export. Explain the exact change. Do not create other files."),timeout=120)
    after=target.read_text(encoding="utf8")
    unexpected=[path.name for path in workspace.iterdir() if path.name!="calculator.mjs"]
    print(json.dumps({"workspace":str(workspace),"before":before,"after":after,"unexpectedFiles":unexpected,"response":turn.final_response,"threadId":thread.id}))

asyncio.run(main())
