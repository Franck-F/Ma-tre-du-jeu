import React, { useState, useEffect, useRef } from "react";

function App() {
  const [agent, setAgent] = useState("storyteller");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("partie-42");
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef(null); // Ref for scrolling to bottom

  const orchestratorUrl = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL;

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input immediately

    setIsLoading(true);

    let payload = { agent, sessionId };
    if (agent === "thrower") payload.expression = userMessage.text;
    else if (agent === "rules-keeper") payload.question = userMessage.text;
    else payload.action = userMessage.text;

    try {
      const res = await fetch(orchestratorUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      let agentResponseText = "Le Maître du Jeu est silencieux...";
      if (data.story) {
        agentResponseText = data.story;
      } else if (data.rule) {
        agentResponseText = data.rule;
      } else if (data.roll) {
        agentResponseText = `Lancer de dés ! Expression: ${data.expression}, Résultat: ${data.result}, Détails: ${data.roll}`;
      } else {
        agentResponseText = JSON.stringify(data, null, 2); // Fallback for raw data
      }

      const agentMessage = { id: Date.now() + 1, sender: "agent", text: agentResponseText };
      setMessages((prevMessages) => [...prevMessages, agentMessage]);

    } catch (error) {
      console.error("Error fetching from orchestrator:", error);
      const errorMessage = { id: Date.now() + 1, sender: "agent", text: "La connexion avec le monde des esprits a échoué. Vérifiez la console." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      <div id="animated-background">
        <div id="smoke-embers-container"></div>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <div id="large-smoke-overlay"></div>
        <div id="large-flame-overlay"></div>
        <div id="cavalier-animation-1"></div>
        <div id="cavalier-animation-2"></div>
        <div id="cavalier-animation-3"></div>
        <div id="dragon-animation-1"></div>
        <div id="dragon-animation-2"></div>
        <div id="sorcier-animation-1"></div>
        <div id="sorcier-animation-2"></div>
        <header className="text-center mb-8">
          <h1 className="font-heading text-6xl sm:text-7xl text-stone-dark font-bold tracking-wider" style={{textShadow: '2px 2px 4px #c0a981'}}>
            Maître du Jeu IA
          </h1>
          <p className="text-stone-dark text-xl mt-2">Votre compagnon d'aventure numérique</p>
        </header>

        <div className="bg-stone-light/20 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-stone-light/20 flex flex-col h-[80vh]"> {/* Added h-[80vh] for chat height */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4"> {/* Added mb-4 for spacing */}
            <div className="flex flex-col">
              <label htmlFor="agent-select" className="font-heading text-base text-white mb-2">Choisir l'Agent</label>
              <select
                id="agent-select"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="p-3 rounded-md bg-stone-dark border border-stone-light text-white focus:ring-2 focus:ring-dragon-red focus:border-dragon-red transition-all"
              >
                <option value="storyteller">Storyteller</option>
                <option value="rules-keeper">Rules Keeper</option>
                <option value="thrower">Thrower</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label htmlFor="user-input" className="font-heading text-base text-white mb-2">Votre Action</label>
              <input
                id="user-input"
                type="text"
                placeholder="Que faites-vous, aventurier ?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()} // Changed to sendMessage
                className="p-3 rounded-md bg-stone-dark border border-stone-light text-white w-full focus:ring-2 focus:ring-dragon-red focus:border-dragon-red transition-all"
              />
            </div>
          </div>

          {/* Chat History Display */}
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 rounded-lg bg-stone-dark/50 mb-4 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    msg.sender === "user"
                      ? "bg-dragon-red text-white"
                      : "bg-parchment text-stone-dark"
                  }`}
                >
                  <p className="font-sans text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[70%] p-3 rounded-lg shadow-md bg-parchment text-stone-dark">
                  <p className="font-sans text-sm">Le Maître du Jeu réfléchit...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto text-center"> {/* mt-auto to push button to bottom */}
            <button
              onClick={sendMessage} // Changed to sendMessage
              disabled={isLoading}
              className="bg-dragon-red hover:bg-red-800 text-white font-heading text-lg px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer au Maître'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;