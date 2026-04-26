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

  res.status(200).json(data);
}
