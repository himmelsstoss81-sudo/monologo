export interface AssessmentResult {
  transcript: string;
  score: number;
  cefrLevel: string;
  criteriaFeedback: {
    eficacia: { feedback: string; score: number };
    coherencia: { feedback: string; score: number };
    correccion: { feedback: string; score: number };
    alcance: { feedback: string; score: number };
    fonologia: { feedback: string; score: number };
  };
  globalAssessment: string;
  noCumpleTarea?: boolean;
}

export async function transcribeAndAssess(
  audioBase64: string,
  language: string,
  targetLevel: string,
  topic: string,
  criteria: string,
  descriptors: string
): Promise<AssessmentResult> {

  const response = await fetch("/api/evaluar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      audioBase64,
      language,
      targetLevel,
      topic,
      criteria,
      descriptors
    })
  });

  if (!response.ok) {
    throw new Error("Error en la API");
  }

  const data = await response.json();
console.log("RESPUESTA BACKEND:", data);
return data;
}
export async function generateTask(language: string, level: string, topic: string) {
  return {
    task: `Habla sobre ${topic} en ${language} (nivel ${level})`,
    questions: [
      "¿Qué opinas sobre este tema?",
      "¿Tienes experiencia personal?",
      "¿Qué ventajas tiene?",
      "¿Qué inconvenientes tiene?",
      "¿Cómo ha cambiado con el tiempo?",
      "¿Qué harías tú?"
    ]
  };
}

export async function translateTopics(_language: string, topics: string[]) {
  return topics;
}
