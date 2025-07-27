document.getElementById("butao-enviar").addEventListener("click", async () => {
    const input = document.getElementById("input-usuario");
    const prompt = input.value;

    if (!prompt.trim()) {
      console.error("Prompt is empty");
      return;
    }

    try{
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

    } catch (error) {
      console.error("Erro ao enviar para a IA:", error.message);
      alert("Ocorreu um erro ao conversar com a IA. Verifique se a API está funcionando.");
    }
});
