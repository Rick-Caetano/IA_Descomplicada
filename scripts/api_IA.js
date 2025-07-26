document.getElementById("butao-enviar").addEventListener("click", async () => {
    const input = document.getElementById("input-usuario");
    const prompt = input.value;

    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log(data.text);
});
