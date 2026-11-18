import asyncio
import json
import sys
import time
import base64
import io
import wave
import numpy as np
from agents import Agent, Runner, RunConfig, set_tracing_disabled
from agents.testing import ScriptedModel, assistant_message
from agents.voice import AudioInput, StreamedAudioInput, VoicePipeline, VoicePipelineConfig
from agents.voice.model import STTModel, TTSModel, StreamedTranscriptionSession, STTModelSettings, TTSModelSettings
from agents.voice.workflow import VoiceWorkflowBase

set_tracing_disabled(True)
number = int(sys.argv[1])
scenario = sys.argv[2]
observed = []

class TranscriptionSession(StreamedTranscriptionSession):
    def __init__(self, audio):
        self.audio = audio
        self.closed = False
    async def transcribe_turns(self):
        # Consume actual queued audio before delivering the deterministic turn.
        while not self.closed:
            chunk = await self.audio.queue.get()
            if chunk is None: break
            observed.append({"stage": "stream-input", "samples": int(chunk.size)})
            yield "Where is order ORD-42?"
    async def close(self):
        self.closed = True

class FixtureSTT(STTModel):
    @property
    def model_name(self): return "classroom-transcript-fixture"
    async def transcribe(self, input, settings, trace_include_sensitive_data, trace_include_sensitive_audio_data):
        observed.append({"stage": "stt", "samples": int(input.buffer.size), "language": settings.language})
        return "Donde esta el pedido ORD-42?" if scenario == "spanish" else "Where is order ORD-42?"
    async def create_session(self, input, settings, trace_include_sensitive_data, trace_include_sensitive_audio_data):
        return TranscriptionSession(input)

class FixtureTTS(TTSModel):
    @property
    def model_name(self): return "classroom-pcm-fixture"
    async def run(self, text, settings):
        observed.append({"stage": "tts", "text": text, "speed": settings.speed})
        # A short PCM tone makes chunk delivery measurable. It represents a
        # deterministic audio fixture, with no speech-recognition quality claim.
        tone = (np.sin(np.arange(2400) * 2 * np.pi * 440 / 24000) * 1200).astype(np.int16)
        for chunk in np.array_split(tone, 3):
            yield chunk.tobytes()
            await asyncio.sleep(0)

class OrderWorkflow(VoiceWorkflowBase):
    async def run(self, transcription):
        observed.append({"stage": "workflow", "transcription": transcription, "agent": "billing" if number == 165 else "support"})
        if scenario == "failure": raise RuntimeError("Controlled workflow failure")
        if number == 165:
            triage=await Runner.run(Agent(name="Voice triage",model=ScriptedModel([[assistant_message("billing" if scenario=="billing" else "support")]])),transcription,run_config=RunConfig(tracing_disabled=True))
            observed.append({"stage":"intermediate-text","route":triage.final_output})
        agent=Agent(name="Order voice agent",model=ScriptedModel([[assistant_message("Order ORD-42 is shipped. The tracking reference is TRACK-42.")]]))
        result=await Runner.run(agent,transcription,run_config=RunConfig(tracing_disabled=True))
        observed.append({"stage":"agent-text","output":result.final_output})
        yield result.final_output

async def main():
    pipeline = VoicePipeline(workflow=OrderWorkflow(), stt_model=FixtureSTT(), tts_model=FixtureTTS(), config=VoicePipelineConfig(tracing_disabled=True, stt_settings=STTModelSettings(language="es" if scenario=="spanish" else "en"), tts_settings=TTSModelSettings(speed=1.2 if scenario=="fast" else 1.0)))
    started=time.perf_counter()
    if number == 162:
        audio = StreamedAudioInput()
        result = await pipeline.run(audio)
        for _ in range(3): await audio.add_audio(np.zeros(800,dtype=np.int16))
        await audio.add_audio(None)
    else:
        result=await pipeline.run(AudioInput(buffer=np.zeros(2400,dtype=np.int16)))
    events=[]
    first=None
    first_audio=None
    audio_chunks=[]
    try:
        async for event in result.stream():
            if first is None: first=(time.perf_counter()-started)*1000
            if event.type=="voice_stream_event_audio":
                if first_audio is None: first_audio=(time.perf_counter()-started)*1000
                audio_chunks.append(event.data.astype(np.int16).tobytes())
            events.append({"type":event.type,"bytes":int(event.data.nbytes) if event.type=="voice_stream_event_audio" else 0})
    except Exception as error:
        events.append({"type":"error","message":str(error)})
    wav=io.BytesIO()
    with wave.open(wav,"wb") as file:
        file.setnchannels(1);file.setsampwidth(2);file.setframerate(24000);file.writeframes(b"".join(audio_chunks))
    print(json.dumps({"pipeline":"Actual Python VoicePipeline", "speechModels":"Deterministic STT and PCM tone fixtures", "observed":observed,"events":events,"firstEventMs":first,"firstAudioMs":first_audio,"totalMs":(time.perf_counter()-started)*1000,"output":"Workflow failed. Inspect the captured error." if scenario=="failure" else "Order ORD-42 is shipped.","streamingInputConfigured":number==162,"audioBase64":base64.b64encode(wav.getvalue()).decode()}))

asyncio.run(main())
