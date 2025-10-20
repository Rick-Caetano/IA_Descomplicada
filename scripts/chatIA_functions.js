document.addEventListener("DOMContentLoaded", (event) => { //Espera o DOM carregar

  const input = document.getElementById("input-usuario");
  const chatBox = document.getElementById("chat-box");
  const dica = document.getElementById("troca_dica");
  const cabeçalhoChat = document.getElementById("cabeçalho-chat");
  const barraTopoChat = document.getElementById("barra-topo-chat");
  const sections = document.querySelectorAll('.full-page');
  const elemento_dica = document.getElementById("dica");
  const area_voltar_pagina = document.getElementById("area_voltar_pagina");

  var alturaInicial = window.innerHeight; 
  var simulaDigitacao = false; // Variável para controlar o estado de digitação

  //Funções

  input.addEventListener("focus", () => {
    document.body.style.overflow = "hidden"; // trava a rolagem
    chatBox.scrollTop = chatBox.scrollHeight; // força mostrar o fim do chat
  });

  input.addEventListener("blur", () => {
    document.body.style.overflow = "auto"; // libera a rolagem de novo
  });

  if (window.innerWidth <= 768) {
    window.addEventListener("resize", () => {

      if (window.innerHeight < alturaInicial) { //se a altura for igual à inicial mostra o elemento
        elemento_dica.classList.add("escondido");
        area_voltar_pagina.classList.add("escondido");
      } else {
        elemento_dica.classList.remove("escondido");
        area_voltar_pagina.classList.remove("escondido");
      }
    });
  }

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
    // Passo 1: Usamos um placeholder temporário e seguro para "proteger" o HTML do código
    // da biblioteca 'marked'.
    const placeholders = [];
    let i = 0;
    const textoComPlaceholders = texto.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, linguagem, codigo) => {
        const nomeLinguagem = linguagem || "markup";
        
        // IMPORTANTE: Escapamos o HTML DENTRO do código para o Prism.js funcionar corretamente.
        const codigoEscapado = codigo.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const blocoHtml = `<div class="bloco-de-codigo" data-linguagem="${nomeLinguagem}"><pre><code class="language-${nomeLinguagem}">${codigoEscapado.trim()}</code></pre></div>`;
        
        const placeholder = `__CODE_BLOCK_${i++}__`;
        placeholders.push({ placeholder: placeholder, html: blocoHtml });
        
        return placeholder;
    });

    // Passo 2: Usar a biblioteca 'marked' para converter TODO O RESTO do Markdown
    // (negrito, itálico, listas, etc.) para HTML.
    // O 'marked' vai ignorar os placeholders.
    let htmlRestante = marked.parse(textoComPlaceholders, { gfm: true, breaks: true });

    // Passo 3: Substituir os placeholders de volta pelos blocos de código HTML formatados.
    placeholders.forEach(p => {
        // Usamos um parágrafo <p> ao redor do placeholder para garantir que o replace funcione
        // mesmo que o 'marked' tenha envolvido ele em um <p>.
        const regexPlaceholder = new RegExp(`<p>${p.placeholder}</p>|${p.placeholder}`);
        htmlRestante = htmlRestante.replace(regexPlaceholder, p.html);
    });

    return htmlRestante;
  }

  function trocarCabecalho() {
    // Se a barra de topo já estiver visível, não faz nada
    if (!barraTopoChat.classList.contains("escondido")) return;

    // Esconde o cabeçalho inicial e mostra a nova barra de topo
    cabeçalhoChat.classList.add("escondido");
    barraTopoChat.classList.remove("escondido");
  }

  //começa a escutar o clique no botão
  document.getElementById("butao-enviar").addEventListener("click", async () => { 
    try {
      const prompt = input.value;

          if (!prompt.trim()) {
            console.error("Prompt is empty");
            return;
          }

      input.value = ""; // Limpa o campo de entrada após enviar a mensagem

      trocarCabecalho(); // Esconde o cabeçalho do chat na primeira interação
      adicionarMensagemTela(prompt, "mensagem_usuario"); 
      mostrarSpinner(); 

      const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Erro na resposta da API: " + response.status);
      }

      let respostaGerada = await response.json();
      respostaGerada = respostaGerada.text.trim();
      if (!respostaGerada || typeof respostaGerada !== "string") {
        adicionarMensagemTela("Desculpe, Ocorreu um erro ao processar sua solicitação.", "mensagem_ia"); //colocar mensagem de erro na tela
        throw new Error("Resposta inválida da API");
      }

      //console.log(respostaGerada); //debug

      await new Promise(resolve => setTimeout(resolve, 2000)); 
      removerSpinner(); // Remove o spinner após a espera
      adicionarMensagemTela(respostaGerada, "mensagem_ia"); 

    } catch (error) {
      console.error("Erro ao enviar para a IA:", error.message);
      alert("Ocorreu um erro ao conversar com a IA. Verifique se a API está funcionando.");
    }
    
  });

  input.addEventListener("keydown", (evento) => {
        // Verifica se a tecla pressionada foi "Enter" E se a tecla "Shift" NÃO foi pressionada
        if (evento.key === "Enter" && !evento.shiftKey) {
        evento.preventDefault(); // Impede que o "Enter" crie uma nova linha no textarea

        // Simula um clique no botão de enviar, acionando toda a lógica do envio
        document.getElementById("butao-enviar").click();
        }
      });

  setInterval(trocaTextoDica, 7000); // Troca a dica a cada 7 segundos;

});
