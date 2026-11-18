from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from starlette.applications import Starlette
from starlette.responses import Response, StreamingResponse, JSONResponse
from starlette.routing import Route
from chatkit.server import StreamingResult
from chatkit_worker import SQLiteStore, TutorServer
import uvicorn
import os

root=Path(__file__).parent
store=SQLiteStore()
server=TutorServer(store)

async def index(request): return Response((root/"chatkit.html").read_text(encoding="utf8"),media_type="text/html")
async def client(request): return Response((root/"chatkit-client.js").read_text(encoding="utf8"),media_type="text/javascript")
async def endpoint(request):
    host=request.headers.get("host","")
    if host.split(":")[0] not in ("localhost","127.0.0.1"): return JSONResponse({"error":"Use localhost"},403)
    if request.headers.get("origin") not in (None,f"http://{host}"): return JSONResponse({"error":"Use the companion origin"},403)
    body=await request.body()
    if len(body)>16384: return JSONResponse({"error":"Request exceeds 16 KiB"},413)
    result=await server.process(body,{"tenant":"teacher-fixture"})
    if isinstance(result,StreamingResult): return StreamingResponse(result,media_type="text/event-stream",headers={"Cache-Control":"no-store"})
    return Response(result.json,media_type="application/json")

app=Starlette(routes=[Route("/",index),Route("/client.js",client),Route("/chatkit",endpoint,methods=["POST"])])
if __name__=="__main__": uvicorn.run(app,host="127.0.0.1",port=int(os.environ.get("CHATKIT_PORT","4191")))
