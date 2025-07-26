import {GoogleGenAI} from '@google/genai';
//document.addEventListener("DOMContentLoaded", () => {

  //Definição de elementos da pagina
const inputUsuario = document.getElementById("input-usuario")
const butaoEnviar = document.getElementById("butao-enviar")

const GEMINI_API_KEY = "AIzaSyDNYeeA-Ojr-YiZFHSLtotpMRvL3zxCULo";//process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


async function solicitacaoIA() {
  
    let prompt = inputUsuario.value.trim(); //pega o valor de userInput

    if (!prompt) return;

    userInput.value = "" //limpa o campo de texto

    //Colocar função para adicionar mensagem do user na tela


    //esta função deve ser mudada para mandar a mensagem para o servidor ao inves do google
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash-001',
      contents: 'Me conte um fato interessante em ate 3 linhas'
    });
    for await (const chunk of response) {
      console.log(chunk.text);
    }    
}

butaoEnviar.addEventListener("click", solicitacaoIA) //fica ouvindo o butao enviar
//});

