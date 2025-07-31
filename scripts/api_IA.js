document.addEventListener("DOMContentLoaded", (event) => { //Espera o DOM carregar

  const input = document.getElementById("input-usuario");
  const chatBox = document.getElementById("chat-box");

  function adicionarMensagemTela(mensagem, estiloClasse) {
    const elementoMensagem = document.createElement("div");
    const paragrafo = document.createElement("p");

    paragrafo.textContent = mensagem;

    elementoMensagem.classList.add("mensagem", `${estiloClasse}`);
    elementoMensagem.appendChild(paragrafo);
    chatBox.appendChild(elementoMensagem);

    chatBox.scrollTop = chatBox.scrollHeight; // Rola para o final do chat
    
  }

  document.getElementById("butao-enviar").addEventListener("click", async () => { //começa a escutar o clique no botão
    
    const prompt = input.value;

    if (!prompt.trim()) {
      console.error("Prompt is empty");
      return;
    }

    try {
      const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Erro na resposta da API: " + response.status);
      }

      const data = await response.json();
      console.log(data.text);

      adicionarMensagemTela(prompt, "mensagem_ia");

    } catch (error) {
      console.error("Erro ao enviar para a IA:", error.message);
      alert("Ocorreu um erro ao conversar com a IA. Verifique se a API está funcionando.");
    }
  });
});
