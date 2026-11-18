"""Self-hosted ChatKit protocol with tenant-scoped SQLite thread storage."""
import asyncio
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from pydantic import TypeAdapter
from agents import Agent, Runner, RunConfig, set_tracing_disabled
from agents.testing import ScriptedModel, assistant_message
from chatkit.server import ChatKitServer, StreamingResult
from chatkit.store import Store, NotFoundError
from chatkit.agents import AgentContext, simple_to_agent_input, stream_agent_response
from chatkit.types import Page, ThreadMetadata, ThreadItem, AssistantMessageItem, AssistantMessageContent, ThreadItemDoneEvent

set_tracing_disabled(True)
database=Path(__file__).resolve().parents[2]/".runtime"/"course"/"chatkit.sqlite"
database.parent.mkdir(parents=True,exist_ok=True)

class SQLiteStore(Store[dict]):
    def __init__(self):
        self.db=sqlite3.connect(database)
        self.db.execute("CREATE TABLE IF NOT EXISTS objects(tenant TEXT, kind TEXT, id TEXT, parent TEXT, body TEXT, PRIMARY KEY(tenant,kind,id))")
    def put(self,kind,id,parent,value,context):
        self.db.execute("INSERT INTO objects VALUES(?,?,?,?,?) ON CONFLICT(tenant,kind,id) DO UPDATE SET body=excluded.body",(context["tenant"],kind,id,parent,value.model_dump_json()))
        self.db.commit()
    def get(self,kind,id,context,model):
        row=self.db.execute("SELECT body FROM objects WHERE tenant=? AND kind=? AND id=?",(context["tenant"],kind,id)).fetchone()
        if row is None: raise NotFoundError(id)
        return TypeAdapter(model).validate_json(row[0])
    def page(self,kind,parent,limit,after,order,context,model):
        rows=self.db.execute("SELECT body FROM objects WHERE tenant=? AND kind=? AND (? IS NULL OR parent=?) ORDER BY rowid "+("DESC" if order=="desc" else "ASC"),(context["tenant"],kind,parent,parent)).fetchall()
        values=[TypeAdapter(model).validate_json(row[0]) for row in rows]
        if after:
            ids=[value.id for value in values]
            values=values[ids.index(after)+1:] if after in ids else []
        return Page(data=values[:limit],has_more=len(values)>limit,after=values[limit-1].id if len(values)>limit else None)
    async def load_thread(self,id,context): return self.get("thread",id,context,ThreadMetadata)
    async def save_thread(self,thread,context): self.put("thread",thread.id,None,thread,context)
    async def load_thread_items(self,thread_id,after,limit,order,context):
        await self.load_thread(thread_id,context)
        return self.page("item",thread_id,limit,after,order,context,ThreadItem)
    async def load_threads(self,limit,after,order,context): return self.page("thread",None,limit,after,order,context,ThreadMetadata)
    async def add_thread_item(self,thread_id,item,context): self.put("item",item.id,thread_id,item,context)
    async def save_item(self,thread_id,item,context): self.put("item",item.id,thread_id,item,context)
    async def load_item(self,thread_id,item_id,context):
        await self.load_thread(thread_id,context)
        item=self.get("item",item_id,context,ThreadItem)
        if item.thread_id!=thread_id: raise NotFoundError(item_id)
        return item
    async def delete_thread(self,thread_id,context):
        self.db.execute("DELETE FROM objects WHERE tenant=? AND (id=? OR parent=?)",(context["tenant"],thread_id,thread_id));self.db.commit()
    async def delete_thread_item(self,thread_id,item_id,context):
        self.db.execute("DELETE FROM objects WHERE tenant=? AND parent=? AND id=?",(context["tenant"],thread_id,item_id));self.db.commit()
    async def save_attachment(self,attachment,context): raise ValueError("Attachments disabled in this classroom integration")
    async def load_attachment(self,attachment_id,context): raise NotFoundError(attachment_id)
    async def delete_attachment(self,attachment_id,context): pass

class TutorServer(ChatKitServer[dict]):
    async def respond(self,thread,input,context):
        page=await self.store.load_thread_items(thread.id,None,20,"asc",context)
        count=sum(item.type=="user_message" for item in page.data)
        model=ScriptedModel([[assistant_message(f"Agent tools run application functions with validated arguments. This thread has {count} user messages.")]])
        agent_context=AgentContext(thread=thread,store=self.store,request_context=context)
        input_items=await simple_to_agent_input(page.data)
        result=Runner.run_streamed(Agent(name="ChatKit tutor",model=model),input_items,context=agent_context,run_config=RunConfig(tracing_disabled=True))
        async for event in stream_agent_response(agent_context,result): yield event

async def main():
    request=sys.argv[1]
    if request=="--test": request=json.dumps({"type":"threads.create","params":{"input":{"content":[{"type":"input_text","text":"Explain tools"}],"attachments":[],"inference_options":{}}}})
    store=SQLiteStore()
    try:
        result=await TutorServer(store).process(request,{"tenant":"teacher-fixture"})
        if isinstance(result,StreamingResult):
            chunks=[chunk.decode() async for chunk in result]
            print(json.dumps({"stream":True,"body":"".join(chunks)}))
        else: print(json.dumps({"stream":False,"body":result.json.decode()}))
    finally: store.db.close()

if __name__=="__main__": asyncio.run(main())
