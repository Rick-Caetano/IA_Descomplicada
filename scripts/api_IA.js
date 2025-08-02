document.addEventListener("DOMContentLoaded", (event) => { //Espera o DOM carregar

  const input = document.getElementById("input-usuario");
  const chatBox = document.getElementById("chat-box");

  //Funções
  function adicionarMensagemTela(mensagem, estiloClasse) {
    const elementoMensagem = document.createElement("div");
    const paragrafo = document.createElement("p");

    paragrafo.textContent = mensagem;

    elementoMensagem.classList.add("mensagem", `${estiloClasse}`);
    elementoMensagem.appendChild(paragrafo);
    chatBox.appendChild(elementoMensagem);

    chatBox.scrollTop = chatBox.scrollHeight; // Rola para o final do chat
    
  }

  function mostrarSpinner(){
    const createSpinner = document.createElement("div");
    createSpinner.classList.add("spinner");
    chatBox.appendChild(createSpinner);
  }

  function removerSpinner() {
    const spinner = chatBox.querySelector(".spinner");
    if (spinner) {
      chatBox.removeChild(spinner);
    }
  }

  function digitarTextoSimulado(elemento, texto, intervalo = 50) {
  let index = 0;

  function limpaTexto(callback) {
    const textoAtual = elemento.textContent;
    let i = textoAtual.length;

    const apagar = setInterval(() => {
      if (i > 0) {
        elemento.textContent = textoAtual.substring(0, --i);
      } else {
        clearInterval(apagar);
        callback(); // Chama a escrita após apagar tudo
      }
    }, intervalo / 2);
  }

  function escreveTexto() {
    const escrever = setInterval(() => {
      if (index < texto.length) {
        elemento.textContent += texto.charAt(index++);
      } else {
        clearInterval(escrever);
      }
    }, intervalo);
  }

  limpaTexto(escreveTexto); 
}

  function trocaTextoDica() {
    const dica = document.getElementById("troca_dica");
    const dicas = [
      "Me conte o que você pode fazer",
      "Me explique o que é um algoritmo como se eu tivesse 10 anos",
      "Quais são os benefícios de usar IA no dia a dia?",
      "Como posso melhorar minha produtividade com IA?",
      "O que é machine learning?"
    ];
    const randomIndex = Math.floor(Math.random() * dicas.length);
    let novaDica = dicas[randomIndex];
    digitarTextoSimulado(dica, novaDica);
  }

  setInterval(trocaTextoDica, 6000); // Troca a dica a cada 6 segundos;

  //começa a escutar o clique no botão
  document.getElementById("butao-enviar").addEventListener("click", async () => { 
    try {
      const prompt = input.value;

          if (!prompt.trim()) {
            console.error("Prompt is empty");
            return;
          }

      input.value = ""; // Limpa o campo de entrada após enviar a mensagem

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
      mostrarSpinner(); // Mostra o spinner enquanto aguarda a resposta da IA
      await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 6 segundos para simular processamento
      removerSpinner(); // Remove o spinner após a espera
      adicionarMensagemTela(respostaGerada, "mensagem_ia"); // Adiciona a resposta

    } catch (error) {
      console.error("Erro ao enviar para a IA:", error.message);
      alert("Ocorreu um erro ao conversar com a IA. Verifique se a API está funcionando.");
    }

    
  });
});
