await customElements.whenDefined("openai-chatkit");
const chatkit = document.querySelector("#chatkit");
chatkit.setOptions({
  api: { url: "/chatkit", domainKey: "local-classroom" },
  theme: "light",
  startScreen: {
    greeting: "Learn about agent tools",
    prompts: [
      {
        label: "Explain tools",
        prompt: "Explain agent tools",
        icon: "sparkle",
      },
    ],
  },
});
chatkit.addEventListener("chatkit.error", (event) => {
  document.querySelector("#status").textContent =
    event.detail?.error?.message ||
    "ChatKit reported an error. Inspect the server output.";
});
