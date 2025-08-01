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

      let respostaGerada = await response.json();
      respostaGerada = respostaGerada.text.trim(); // Remove espaços em branco no início e no final da resposta
      if (!respostaGerada || typeof respostaGerada !== "string") {
        adicionarMensagemTela("Desculpe, Ocorreu um erro ao processar sua solicitação.", "mensagem_ia"); //colocar mensagem de erro na tela
        throw new Error("Resposta inválida da API");
        
      }

      console.log(respostaGerada);

      adicionarMensagemTela(prompt, "mensagem_usuario"); // Adiciona a mensagem do usuário
      await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 1 segundo para simular processamento
      adicionarMensagemTela(respostaGerada, "mensagem_ia"); // Adiciona a resposta

    } catch (error) {
      console.error("Erro ao enviar para a IA:", error.message);
      alert("Ocorreu um erro ao conversar com a IA. Verifique se a API está funcionando.");
    }
  });
});
