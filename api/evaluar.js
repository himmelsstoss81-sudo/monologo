export default async function handler(req, res) {
  const { audioBase64, language, targetLevel, topic, criteria } = req.body;

  const prompt = `
Eres un profesor de Castilla y León.
Evalúa este monólogo:
${topic}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "audio/webm",
                  data: audioBase64,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

// 🔥 Buscar texto en cualquier parte
let text = "";

try {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  text = parts.map(p => p.text || "").join(" ");
} catch (e) {
  text = "";
}

// Intentar parsear JSON
let parsed;

try {
  parsed = JSON.parse(text);
} catch (e) {
  parsed = {
    transcript: text || "No se pudo procesar la respuesta",
    score: 0,
    cefrLevel: "N/A",
    criteriaFeedback: {
      eficacia: { feedback: "", score: 0 },
      coherencia: { feedback: "", score: 0 },
      correccion: { feedback: "", score: 0 },
      alcance: { feedback: "", score: 0 },
      fonologia: { feedback: "", score: 0 }
    },
    globalAssessment: text
  };
}

res.status(200).json(parsed);

}
