document.addEventListener("DOMContentLoaded", (event) => { //Espera o DOM carregar

  const input = document.getElementById("input-usuario");
  const chatBox = document.getElementById("chat-box");

  var simulaDigitacao = false; // Variável para controlar o estado de digitação

  //Funções
  input.addEventListener("focus", () => {
    document.body.style.overflow = "hidden"; // trava a rolagem
    chatBox.scrollTop = chatBox.scrollHeight; // força mostrar o fim do chat
  });

  input.addEventListener("blur", () => {
    document.body.style.overflow = ""; // libera a rolagem de novo
  });
   // --- VIEWPORT HEIGHT CORRECTION ---
  const setViewportHeight = () => {
    // Obtemos a altura interna da janela e calculamos 1% dela
    let vh = window.innerHeight * 0.01;
    // nos setamos o valor na propriedade CSS --vh no root do documento
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setViewportHeight();

  // Fica ouvindo o evento de redimensionamento
  window.addEventListener('resize', setViewportHeight);

  function adicionarMensagemTela(mensagem, estiloClasse) {
    const elementoMensagem = document.createElement("div");

    elementoMensagem.classList.add("mensagem", `${estiloClasse}`);
    

    if (estiloClasse === "mensagem_ia") {
      const htmlFormatado = formatarScriptMensagem(mensagem); // Formata a mensagem se for da IA
      elementoMensagem.innerHTML = htmlFormatado; // Usa innerHTML para renderizar o HTML formatado
    } else {
      const paragrafo = document.createElement("p");
      paragrafo.textContent = mensagem;
      elementoMensagem.appendChild(paragrafo);
    }
    
    chatBox.appendChild(elementoMensagem);

    chatBox.scrollTop = chatBox.scrollHeight; // Rola para o final do chat

    // Se a mensagem for da IA, pedimos ao Prism para colorir o código!
    if (estiloClasse === 'mensagem_ia') {
        Prism.highlightAll();
    }
    
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
    if (simulaDigitacao) return;
    simulaDigitacao = true; // Define que a digitação está em andamento
    
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
          simulaDigitacao = false; // Define que a digitação terminou
        }
      }, intervalo);
    }

    limpaTexto(escreveTexto); 
  }

  function trocaTextoDica() {
    const dica = document.getElementById("troca_dica");
    const dicas = [
      "Me conte o que você pode fazer",
      "Me explique o contexto da seguinte frase ...",
      "Gere questões de Matemática para me ajudar na prova do concurso",
      "Preciso de inspiração para um projeto de faculdade sobre...",
      "Me ajude a criar programa de computador para fazer ...",
      "Me ajude a escrever um e-mail ...",
      "Me ajude a entender um conceito difícil sobre ...",
      "Deixe essas palavras mais formais: ...",
      "Me ajude a criar um currículo para a vaga de ...",
      "Deixe esse texto toda maisculo: 'texto a ser deixado em maiúsculo'"
    ];
    const randomIndex = Math.floor(Math.random() * dicas.length);
    let novaDica = dicas[randomIndex];
    digitarTextoSimulado(dica, novaDica);
  }

  function formatarScriptMensagem(texto) {
    const regexCodigo =/```(\w+)?\n([\s\S]*?)```/g // Regex para detectar blocos de código

    const textoFormatado = texto.replace(regexCodigo, (match, linguagem, codigo) => {
      const nomeLinguagem = linguagem || "markup" // Se não houver linguagem, usa "markup"

      const codigoFormatado = codigo.replace(/</g, "<").replace(/>/g, ">"); // Escapa os caracteres < e >

      return `<div class="bloco-de-codigo"><pre><code class="language-${nomeLinguagem}">${codigoFormatado.trim()}</code></pre></div>`;
    });

    // Se não houver blocos de código, retorna o texto normal
    if (!textoFormatado.includes('div class="bloco-de-codigo"')) {
      return `<p>${texto}</p>`; 
    }

    //para texto misto, envolvemos o texto fora dos blocos em paragrafos
    return textoFormatado.replace(/(^|<\/div>)([^<]*?)(<div class=|$)/g, (match, antes, textoSolto, depois) => {
      const textoLimpo = textoSolto.trim();

      if (textoLimpo) {
        return `${antes}<p>${textoLimpo}</p>${depois}`; //retorna o texto misto
      }

      return `${antes}${depois}`; // Se não houver texto solto, apenas retorna o que estava antes e depois
    });
  }

  definirAlturaViewport(); 
  setInterval(trocaTextoDica, 10000); // Troca a dica a cada 10 segundos;
  document.addEventListener("resize", definirAlturaViewport); // Atualiza a altura da viewport ao redimensionar a janela (exemplo: virar tela)

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
