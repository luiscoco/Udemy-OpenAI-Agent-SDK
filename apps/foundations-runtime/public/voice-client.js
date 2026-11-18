let peer, stream, channel, audio;
export function disconnectVoice() {
  channel?.close();
  peer?.close();
  stream?.getTracks().forEach((track) => track.stop());
  audio?.remove();
  peer = stream = channel = audio = undefined;
}
export async function connectVoice(status) {
  disconnectVoice();
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const response = await fetch("/api/realtime-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const secret = await response.json();
    if (!response.ok) throw new Error(secret.error);
    peer = new RTCPeerConnection();
    audio = document.createElement("audio");
    audio.autoplay = true;
    document.body.append(audio);
    peer.ontrack = (event) => {
      audio.srcObject = event.streams[0];
    };
    peer.onconnectionstatechange = () => {
      status.textContent = `WebRTC ${peer?.connectionState ?? "closed"}`;
    };
    for (const track of stream.getTracks()) peer.addTrack(track, stream);
    channel = peer.createDataChannel("oai-events");
    channel.onmessage = (event) => {
      const item = JSON.parse(event.data);
      if (item.type.includes("transcript") || item.type === "error")
        status.textContent = JSON.stringify(item, null, 2);
    };
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const answer = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret.value}`,
        "Content-Type": "application/sdp",
      },
      body: offer.sdp,
    });
    if (!answer.ok)
      throw new Error(`WebRTC negotiation failed, HTTP ${answer.status}`);
    await peer.setRemoteDescription({
      type: "answer",
      sdp: await answer.text(),
    });
    status.textContent = "Microphone connected. Speak to the tutor.";
  } catch (error) {
    disconnectVoice();
    status.textContent = error.message;
  }
}
window.addEventListener("pagehide", disconnectVoice);
