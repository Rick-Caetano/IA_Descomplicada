# IA Descomplicada

Página introdutória para aproximar pessoas leigas da Inteligência Artificial, explicando de forma simples o que é e como usar essas ferramentas no dia a dia, com um chat de exemplo para testar na prática.

Projeto de extensão universitária, desenvolvido para tornar o primeiro contato com IA generativa mais acessível, sem exigir conhecimento técnico prévio.

## Sobre o projeto

O site apresenta o tema de forma didática e disponibiliza um chat funcional onde qualquer visitante pode conversar com um modelo de IA diretamente pelo navegador, sem precisar criar conta ou instalar nada.

## Tecnologias

- HTML, CSS e JavaScript puro no front-end
- [Marked](https://marked.js.org/) para renderizar Markdown nas respostas do chat
- [Prism.js](https://prismjs.com/) para destacar blocos de código nas respostas
- Vercel Functions (`/api`) para o back-end serverless
- [Groq](https://groq.com/) como provedor do modelo de IA (`llama-3.3-70b-versatile`), consumido via `groq-sdk`

## Estrutura

```
index.html              Página inicial
pages/                   Páginas do chat e pop-up
scripts/                 Lógica do front-end (chat e interações)
assets/                  Imagens e estilos
api/gemini.js            Função serverless que fala com a IA
```

## Configuração

A função serverless em `api/gemini.js` depende de uma variável de ambiente:

```
GROQ_API_KEY=<sua chave da Groq>
```

Ela já está configurada como secret no projeto na Vercel (produção, preview e desenvolvimento).

## Hospedagem

O site está publicado na [Vercel](https://vercel.com/).
