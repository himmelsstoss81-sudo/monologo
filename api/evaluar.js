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

// 🔥 Extraer texto de Gemini
const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

// Intentar convertir a JSON (porque tú lo pides así en el prompt)
let parsed;

try {
  parsed = JSON.parse(text);
} catch (e) {
  // Si falla, devolver algo básico para no romper la app
  parsed = {
    transcript: text,
    score: 0,
    cefrLevel: "N/A",
    criteriaFeedback: {},
    globalAssessment: text
  };
}

res.status(200).json(parsed);

}
