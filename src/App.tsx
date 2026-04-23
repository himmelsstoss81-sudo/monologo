import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Mic, 
  Square, 
  RefreshCw, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  BookOpen,
  MessageSquare,
  Award
} from 'lucide-react';
import { LANGUAGES, CEFRLevel, TOPICS, CYL_RUBRICS, Language } from './constants';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

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
}

async function transcribeAndAssess(audioBase64: string, language: string, targetLevel: string, topic: string, criteria: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Analiza este audio en ${language} para nivel ${targetLevel}. Tema: ${topic}. Criterios: ${criteria}. Responde solo en JSON.`;
  try {
    // Formato corregido para la librería @google/generative-ai
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "audio/webm",
          data: audioBase64
        }
      }
    ]);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) { 
    console.error("Error en Gemini:", error);
    throw error; 
  }
}

async function generateTask(language: string, level: string, topic: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Crea una tarea de speaking para ${language} ${level} sobre ${topic}. JSON: {"task": "...", "questions": []}`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    throw error;
  }
}


async function translateTopics(language: string, topics: string[]) { return topics; }


type Screen = 'LANGUAGE_SELECT' | 'CONFIG' | 'TASK' | 'FEEDBACK' | 'LOADING';

export default function App() {
    useEffect(() => {
    // Prueba forzada de micrófono nada más cargar la app
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => console.log("Micro funcionando"))
      .catch((err) => alert("El navegador bloquea el micro: " + err));
  }, []);
  const [screen, setScreen] = useState<Screen>('LANGUAGE_SELECT');
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [level, setLevel] = useState<CEFRLevel>('B1');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(60); // seconds
  const [task, setTask] = useState<{ task: string; questions: string[] } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [quotaError, setQuotaError] = useState(false);
  const [translatedTopics, setTranslatedTopics] = useState<string[]>([]);
  const [isTranslatingTopics, setIsTranslatingTopics] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoStopRef = useRef<NodeJS.Timeout | null>(null);

  // UI Translations (Simplified mapping for core UI)
  const t = (key: string) => {
    if (!selectedLang) return key;
    const translations: Record<string, Record<string, string>> = {
      'es': {
        'choose_level': 'Elige tu nivel MCER',
        'choose_topic': 'Elige un tema',
        'choose_duration': '¿Cuánto tiempo quieres hablar?',
        'start_practice': 'Empezar práctica',
        'ready_to_speak': '¿Listo para hablar?',
        'stop': 'Detener',
        'record': 'Grabar',
        'feedback': 'Ver Feedback',
        'loading_task': 'Generando tarea...',
        'loading_feedback': 'Analizando tu producción...',
        'transcript': 'Transcripción',
        'overall_score': 'Puntuación Total',
        'cefr_assessment': 'Nivel MCER Evaluado',
        'criteria': 'Criterios de Evaluación',
        'suggestions': 'Sugerencias de mejora',
        'corrections': 'Correcciones',
        'listen_again': 'Escuchar de nuevo',
        'effectiveness': 'Eficacia Comunicativa',
        'organization': 'Coherencia y Cohesión',
        'richness': 'Alcance y Uso',
        'accuracy': 'Corrección',
        'phonology': 'Fonología y Fluidez',
        'new_session': 'Nueva Sesión',
        'try_again': 'Intentar de nuevo',
        'recording': 'Grabando',
        'ready': 'Listo',
        'translating': 'Traduciendo temas...',
        'quota_title': 'Límite de cuota excedido',
        'quota_msg': 'Se ha alcanzado el límite de peticiones gratuitas a la IA. Por favor, espera un minuto o inténtalo más tarde.'
      },
      'en': {
        'choose_level': 'Choose your CEFR level',
        'choose_topic': 'Choose a topic',
        'choose_duration': 'How long do you want to speak for?',
        'start_practice': 'Start Practice',
        'ready_to_speak': 'Ready to speak?',
        'stop': 'Stop',
        'record': 'Record',
        'feedback': 'Get Feedback',
        'loading_task': 'Generating task...',
        'loading_feedback': 'Analyzing your production...',
        'transcript': 'Transcript',
        'overall_score': 'Overall Score',
        'cefr_assessment': 'CEFR Assessment',
        'criteria': 'Assessment Criteria',
        'suggestions': 'Suggestions for improvement',
        'corrections': 'Corrections',
        'listen_again': 'Listen again',
        'effectiveness': 'Communicative Effectiveness',
        'organization': 'Coherence and Cohesion',
        'richness': 'Range and Usage',
        'accuracy': 'Correctness',
        'phonology': 'Phonology & Fluency',
        'new_session': 'New Session',
        'try_again': 'Try again',
        'recording': 'Recording',
        'ready': 'Ready',
        'translating': 'Translating topics...',
        'quota_title': 'Quota limit reached',
        'quota_msg': 'The free limit for AI requests has been reached. Please wait a minute or try again later.'
      },
      'fr': {
        'choose_level': 'Choisissez votre niveau CECRL',
        'choose_topic': 'Choisissez un sujet',
        'choose_duration': 'Combien de temps voulez-vous parler ?',
        'start_practice': 'Commencer la pratique',
        'ready_to_speak': 'Prêt à parler ?',
        'stop': 'Arrêter',
        'record': 'Enregistrer',
        'feedback': 'Obtenir des commentaires',
        'loading_task': 'Génération de la tâche...',
        'loading_feedback': 'Analyse de votre production...',
        'transcript': 'Transcription',
        'overall_score': 'Score global',
        'cefr_assessment': 'Évaluation CECRL',
        'criteria': 'Critères d\'évaluation',
        'suggestions': 'Suggestions d\'amélioration',
        'corrections': 'Corrections',
        'listen_again': 'Écouter à nouveau',
        'effectiveness': 'Efficacité communicative',
        'organization': 'Organisation du discours et fluidité',
        'richness': 'Richesse linguistique',
        'accuracy': 'Correction linguistique',
        'phonology': 'Phonologie et fluidité',
        'new_session': 'Nouvelle session',
        'try_again': 'Réessayer',
        'recording': 'Enregistrement',
        'ready': 'Prêt',
        'translating': 'Traduction des sujets...',
        'quota_title': 'Limite de quota atteinte',
        'quota_msg': 'La limite gratuite pour les requêtes AI a été atteinte. Veuillez patienter une minute ou réessayer plus tard.'
      },
      'de': {
        'choose_level': 'Wählen Sie Ihr GER-Niveau',
        'choose_topic': 'Wählen Sie ein Thema',
        'choose_duration': 'Wie lange möchten Sie sprechen?',
        'start_practice': 'Übung starten',
        'ready_to_speak': 'Bereit zu sprechen?',
        'stop': 'Stopp',
        'record': 'Aufnehmen',
        'feedback': 'Feedback erhalten',
        'loading_task': 'Aufgabe wird generiert...',
        'loading_feedback': 'Ihre Produktion wird analysiert...',
        'transcript': 'Transkript',
        'overall_score': 'Gesamtpunktzahl',
        'cefr_assessment': 'GER-Bewertung',
        'criteria': 'Bewertungskriterien',
        'suggestions': 'Verbesserungsvorschläge',
        'corrections': 'Korrekturen',
        'listen_again': 'Noch einmal anhören',
        'effectiveness': 'Kommunikative Effektivität',
        'organization': 'Diskursorganisation & Flüssigkeit',
        'richness': 'Linguistischer Reichtum',
        'accuracy': 'Linguistische Korrektheit',
        'phonology': 'Phonologie & Flüssigkeit',
        'new_session': 'Neue Sitzung',
        'try_again': 'Erneut versuchen',
        'recording': 'Aufnahme läuft',
        'ready': 'Bereit',
        'translating': 'Themen werden übersetzt...',
        'quota_title': 'Kontingentlimit erreicht',
        'quota_msg': 'Das kostenlose Limit für KI-Anfragen wurde erreicht. Bitte warten Sie eine Minute oder versuchen Sie es later erneut.'
      },
      'it': {
        'choose_level': 'Scegli il tuo livello QCER',
        'choose_topic': 'Scegli un argomento',
        'choose_duration': 'Per quanto tempo vuoi parlare?',
        'start_practice': 'Inizia la pratica',
        'ready_to_speak': 'Pronto a parlare?',
        'stop': 'Fermati',
        'record': 'Registra',
        'feedback': 'Ottieni feedback',
        'loading_task': 'Generazione del compito...',
        'loading_feedback': 'Analisi della tua produzione...',
        'transcript': 'Trascrizione',
        'overall_score': 'Punteggio totale',
        'cefr_assessment': 'Valutazione QCER',
        'criteria': 'Criteri di valutazione',
        'suggestions': 'Suggerimenti per il miglioramento',
        'corrections': 'Correzioni',
        'listen_again': 'Ascolta di nuovo',
        'effectiveness': 'Efficacia comunicativa',
        'organization': 'Organizzazione del discorso e fluidità',
        'richness': 'Ricchezza linguistica',
        'accuracy': 'Correttezza linguistica',
        'phonology': 'Fonologia e fluidità',
        'new_session': 'Nuova sessione',
        'try_again': 'Riprova',
        'recording': 'Registrazione',
        'ready': 'Pronto',
        'translating': 'Traduzione argomenti...',
        'quota_title': 'Limite di quota raggiunto',
        'quota_msg': 'Il limite gratuito per le richieste AI è stato raggiunto. Attendi un minuto o riprova más tardi.'
      },
      'ru': {
        'choose_level': 'Выберите ваш уровень CEFR',
        'choose_topic': 'Выберите тему',
        'choose_duration': 'Как долго вы хотите говорить?',
        'start_practice': 'Начать практику',
        'ready_to_speak': 'Готовы говорить?',
        'stop': 'Стоп',
        'record': 'Запись',
        'feedback': 'Получить отзыв',
        'loading_task': 'Генерация задания...',
        'loading_feedback': 'Анализ вашей продукции...',
        'transcript': 'Транскрипт',
        'overall_score': 'Общий балл',
        'cefr_assessment': 'Оценка CEFR',
        'criteria': 'Критерии оценки',
        'suggestions': 'Предложения по улучшению',
        'corrections': 'Исправления',
        'listen_again': 'Слушать снова',
        'effectiveness': 'Коммуникативная эффективность',
        'organization': 'Организация дискурса и беглость',
        'richness': 'Лингвистическое богатство',
        'accuracy': 'Лингвистическая точность',
        'phonology': 'Фонология и беглость',
        'new_session': 'Новая сессия',
        'try_again': 'Попробовать снова',
        'recording': 'Запись...',
        'ready': 'Готово',
        'translating': 'Перевод тем...',
        'quota_title': 'Лимит квоты исчерпан',
        'quota_msg': 'Достигнут бесплатный лимит запросов к ИИ. Пожалуйста, подождите минуту или попробуйте позже.'
      },
      'ca': {
        'choose_level': 'Tria el teu nivell MECR',
        'choose_topic': 'Tria un tema',
        'choose_duration': 'Quant de temps vols parlar?',
        'start_practice': 'Començar pràctica',
        'ready_to_speak': 'Llest per parlar?',
        'stop': 'Aturar',
        'record': 'Gravar',
        'feedback': 'Veure Feedback',
        'loading_task': 'Generant tasca...',
        'loading_feedback': 'Analitzant la teva producció...',
        'transcript': 'Transcripció',
        'overall_score': 'Puntuació Total',
        'cefr_assessment': 'Nivell MECR Evaluat',
        'criteria': 'Criteris d\'Avaluació',
        'suggestions': 'Suggeriments de millora',
        'corrections': 'Correccions',
        'listen_again': 'Escoltar de nou',
        'effectiveness': 'Eficàcia Comunicativa',
        'organization': 'Organització i Fluïdesa',
        'richness': 'Riquesa Lingüística',
        'accuracy': 'Correcció i Pronunciació',
        'phonology': 'Fonologia i fluïdesa',
        'new_session': 'Nova Sessió',
        'try_again': 'Tornar a provar',
        'recording': 'Gravant',
        'ready': 'Llest',
        'translating': 'Traduint temes...',
        'quota_title': 'Límit de quota excedit',
        'quota_msg': 'S\'ha assolit el límit de peticions gratuïtes a la IA. Per favor, espera un minut o intenta-ho més tard.'
      },
      'zh': {
        'choose_level': '选择您的 CEFR 等级',
        'choose_topic': '选择一个主题',
        'choose_duration': '您想说多久？',
        'start_practice': '开始练习',
        'ready_to_speak': '准备好说话了吗？',
        'stop': '停止',
        'record': '录音',
        'feedback': '获取反馈',
        'loading_task': '正在生成任务...',
        'loading_feedback': '正在分析您的表达...',
        'transcript': '转录文本',
        'overall_score': '总分',
        'cefr_assessment': 'CEFR 评估',
        'criteria': '评估标准',
        'suggestions': '改进建议',
        'corrections': '纠错',
        'listen_again': '再次收听',
        'effectiveness': '沟通有效性',
        'organization': '话语组织与流利度',
        'richness': '语言丰富度',
        'accuracy': '语言准确性',
        'phonology': '语音与流利度',
        'new_session': '新练习',
        'try_again': '再试一次',
        'recording': '正在录音',
        'ready': '准备就绪',
        'translating': '正在翻译主题...',
        'quota_title': '配额上限已达到',
        'quota_msg': '已达到 AI 请求的免费限制。请稍等片刻或稍后再试。'
      },
      'el': {
        'choose_level': 'Επιλέξτε το επίπεδο CEFR',
        'choose_topic': 'Επιλέξτε ένα θέμα',
        'choose_duration': 'Για πόση ώρα θέλετε να μιλήσετε;',
        'start_practice': 'Έναρξη εξάσκησης',
        'ready_to_speak': 'Είστε έτοιμοι να μιλήσετε;',
        'stop': 'Διακοπή',
        'record': 'Εγγραφή',
        'feedback': 'Λήψη σχολίων',
        'loading_task': 'Δημιουργία εργασίας...',
        'loading_feedback': 'Ανάλυση της παραγωγής σας...',
        'transcript': 'Απομαγνητοφώνηση',
        'overall_score': 'Συνολική βαθμολογία',
        'cefr_assessment': 'Αξιολόγηση CEFR',
        'criteria': 'Κριτήρια αξιολόγησης',
        'suggestions': 'Προτάσεις βελτίωσης',
        'corrections': 'Διορθώσεις',
        'listen_again': 'Ακούστε ξανά',
        'effectiveness': 'Επικοινωνιακή αποτελεσματικότητα',
        'organization': 'Οργάνωση λόγου και ευχέρεια',
        'richness': 'Γλωσσικός πλούτος',
        'accuracy': 'Γλωσσική ακρίβεια',
        'phonology': 'Φωνολογία και ευχέρεια',
        'new_session': 'Νέα συνεδρία',
        'try_again': 'Δοκιμάστε ξανά',
        'recording': 'Εγγραφή σε εξέλιξη',
        'ready': 'Έτοιμο',
        'translating': 'Μετάφραση θεμάτων...',
        'quota_title': 'Το όριο ποσόστωσης συμπληρώθηκε',
        'quota_msg': 'Το δωρεάν όριο για αιτήματα AI έχει συμπληρωθεί. Παρακαλούμε περιμένετε ένα λεπτό ή δοκιμάστε ξανά αργότερα.'
      }
    };
    
    const langId = selectedLang.id.split('-')[0];
    const langMap = translations[langId] || translations['en'];
    return langMap[key] || key;
  };

      const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result?.toString().split(',')[1];
          setAudioBase64(base64data || null);
          setAudioUrl(URL.createObjectURL(audioBlob));
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setQuotaError(false);
      setTimeLeft(duration);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Error al acceder al micro:", err);
      alert("Error: No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };


  const handleStartPractice = async () => {
    setScreen('LOADING');
    setLoadingMsg(t('loading_task'));
    setQuotaError(false);
    try {
      const generated = await generateTask(selectedLang!.name, level, topic);
      setTask(generated);
      setScreen('TASK');
    } catch (err: any) {
      console.error(err);
      if (err.message === 'QUOTA_EXCEEDED') {
        setQuotaError(true);
      }
      setScreen('CONFIG');
    }
  };

  const handleGetFeedback = async () => {
    if (!audioBase64) return;
    setScreen('LOADING');
    setLoadingMsg(t('loading_feedback'));
    setQuotaError(false);
    try {
      const result = await transcribeAndAssess(
        audioBase64,
        selectedLang!.name,
        level,
        topic,
        CYL_RUBRICS[level] || CYL_RUBRICS['A2'],
        ''
      );
      setAssessment(result);
      setScreen('FEEDBACK');
    } catch (err: any) {
      console.error(err);
      if (err.message === 'QUOTA_EXCEEDED') {
        setQuotaError(true);
      }
      setScreen('TASK');
    }
  };

  const getTopicList = () => {
    if (level === 'A1' || level === 'A2') return TOPICS['A1-A2'];
    if (level === 'B1') return TOPICS['B1'];
    if (level === 'B2') return TOPICS['B2'];
    return TOPICS['C1-C2'];
  };

  useEffect(() => {
    const topics = getTopicList();
    if (selectedLang) {
      setIsTranslatingTopics(true);
      translateTopics(selectedLang.name, topics).then(translated => {
        setTranslatedTopics(translated);
        if (!translated.includes(topic)) {
          setTopic(translated[0]);
        }
        setIsTranslatingTopics(false);
      }).catch(err => {
        console.error("Translation error:", err);
        setTranslatedTopics(topics);
        setIsTranslatingTopics(false);
      });
    } else {
      if (!topics.includes(topic)) {
        setTopic(topics[0]);
      }
    }
  }, [level, selectedLang]);

  const calculateDetailedScore = (assessment: AssessmentResult) => {
    const isLevelA = level === 'A1' || level === 'A2';
    const pointsMapA: Record<number, number> = { 3: 2.500, 2: 1.875, 1: 1.000, 0: 0.3125 };
    const pointsMapBC: Record<number, number> = { 3: 2.000, 2: 1.500, 1: 0.800, 0: 0.250 };
    const map = isLevelA ? pointsMapA : pointsMapBC;

    const scores = assessment.criteriaFeedback;
    
    // Safely get band score as integer
    const getBand = (obj: any) => {
      if (!obj || obj.score === undefined) return 0;
      const val = Math.round(Number(obj.score));
      return isNaN(val) ? 0 : val;
    };

    const bands = {
      eficacia: getBand(scores.eficacia),
      coherencia: getBand(scores.coherencia),
      correccion: getBand(scores.correccion),
      alcance: getBand(scores.alcance),
      fonologia: getBand(scores.fonologia),
    };

    return (
      (map[bands.eficacia] || 0) +
      (map[bands.coherencia] || 0) +
      (map[bands.correccion] || 0) +
      (map[bands.alcance] || 0) +
      (map[bands.fonologia] || 0)
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] selection:bg-[#1D41DB] selection:text-white">
      <AnimatePresence mode="wait">
        {screen === 'LANGUAGE_SELECT' && (
          <motion.div 
            key="lang"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-6 py-20 text-center"
          >
            <Globe className="w-16 h-16 mx-auto mb-8 text-[#1D41DB]" />
            <h1 className="text-5xl font-bold mb-12 tracking-tight text-[#1D41DB]">Choose your language</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLang(lang);
                    setScreen('CONFIG');
                  }}
                  className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md hover:bg-[#1D41DB] hover:text-white transition-all duration-300 group"
                >
                  <span className="block text-xl font-bold mb-1">{lang.nativeName}</span>
                  <span className="block text-xs opacity-60 group-hover:opacity-100 font-bold">{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {screen === 'CONFIG' && (
          <motion.div 
            key="config"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-6 py-16"
          >
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-black/5">
              <h2 className="text-3xl font-bold mb-8 text-center text-[#1D41DB]">{t('choose_level')}</h2>
              
              {quotaError && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 text-red-700">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <p className="font-bold">{t('quota_title')}</p>
                    <p className="text-sm">{t('quota_msg')}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l as CEFRLevel)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                      level === l ? 'bg-[#1D41DB] text-white scale-110' : 'bg-white border border-black/5 hover:bg-[#F5F5F0]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="mb-10">
                <label className="block text-sm uppercase tracking-widest mb-3 opacity-50 font-bold text-[#1D41DB]">{t('choose_topic')}</label>
                <select 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isTranslatingTopics}
                  className="w-full p-4 bg-white rounded-2xl border border-black/5 focus:ring-2 focus:ring-[#1D41DB] outline-none text-lg disabled:opacity-50 font-bold"
                >
                  {(translatedTopics.length > 0 ? translatedTopics : getTopicList()).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {isTranslatingTopics && <p className="text-xs mt-2 text-[#1D41DB] animate-pulse">{t('translating')}</p>}
              </div>

              <div className="mb-12">
                <label className="block text-sm uppercase tracking-widest mb-3 opacity-50 font-bold text-[#1D41DB]">{t('choose_duration')}</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {[60, 90, 120, 150, 180].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDuration(s)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all ${
                        duration === s ? 'bg-[#1D41DB] text-white' : 'bg-white border border-black/5 hover:bg-[#F5F5F0]'
                      }`}
                    >
                      {Math.floor(s / 60)}m {s % 60 ? '30s' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartPractice}
                className="w-full py-5 bg-[#1D41DB] text-white rounded-2xl text-xl font-bold hover:bg-[#1532A8] transition-colors flex items-center justify-center gap-3"
              >
                {t('start_practice')}
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {screen === 'TASK' && task && (
          <motion.div 
            key="task"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                  <h3 className="text-sm uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2 font-bold text-[#1D41DB]">
                    <BookOpen className="w-4 h-4" />
                    {topic}
                  </h3>
                  
                  {quotaError && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 text-red-700">
                      <AlertCircle className="w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-bold">{t('quota_title')}</p>
                        <p className="text-sm">{t('quota_msg')}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-2xl leading-relaxed mb-8 font-bold text-[#1D41DB]">{task.task}</p>
                  <div className="space-y-4">
                    {task.questions.map((q, i) => (
                      <div key={i} className="flex gap-4 items-start p-4 bg-[#F5F5F0] rounded-2xl">
                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold shrink-0 text-[#1D41DB] border border-[#1D41DB]">{i + 1}</span>
                        <p className="text-lg">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 text-center">
                  <div className="mb-6">
                    <div className={`text-6xl font-mono mb-2 ${timeLeft < 10 && isRecording ? 'text-red-500 animate-pulse' : ''}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-xs uppercase tracking-widest opacity-50 font-bold">{isRecording ? t('recording') : t('ready')}</p>
                  </div>

                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={!!audioUrl}
                      className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 text-xl font-bold transition-all ${
                        audioUrl ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200'
                      }`}
                    >
                      <Mic className="w-6 h-6" />
                      {t('record')}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-full py-6 bg-[#1A1A1A] text-white rounded-2xl flex items-center justify-center gap-3 text-xl font-bold hover:bg-black transition-all"
                    >
                      <Square className="w-6 h-6" />
                      {t('stop')}
                    </button>
                  )}

                  {audioUrl && !isRecording && (
                    <div className="mt-6 space-y-4">
                      <audio src={audioUrl} controls className="w-full" />
                      <button
                        onClick={handleGetFeedback}
                        className="w-full py-5 bg-[#1D41DB] text-white rounded-2xl text-xl font-bold hover:bg-[#1532A8] transition-colors flex items-center justify-center gap-3"
                      >
                        {t('feedback')}
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => { setAudioUrl(null); setAudioBase64(null); }}
                        className="w-full py-3 text-sm opacity-50 hover:opacity-100 flex items-center justify-center gap-2 font-bold"
                      >
                        <RefreshCw className="w-4 h-4" />
                        {t('try_again')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'LOADING' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-[#1D41DB]/20 border-t-[#1D41DB] rounded-full animate-spin"></div>
              <Mic className="w-8 h-8 text-[#1D41DB] absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="mt-8 text-xl font-bold tracking-wide text-[#1D41DB]">{loadingMsg}</p>
          </motion.div>
        )}

        {screen === 'FEEDBACK' && assessment && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto px-6 py-12"
          >
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 text-center">
                  <div className="w-24 h-24 bg-[#1D41DB] text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                    {calculateDetailedScore(assessment).toFixed(2)}
                  </div>
                  <p className="text-xs uppercase tracking-widest opacity-50 mb-6 font-bold text-[#1D41DB]">{t('overall_score')}</p>
                  <p className="text-[10px] opacity-40 mb-2 font-bold italic">Puntos según sistema CYL</p>
                  
                  <div className="py-4 border-t border-black/5">
                    <p className="text-2xl font-bold text-[#1D41DB]">{assessment.cefrLevel}</p>
                    <p className="text-xs uppercase tracking-widest opacity-50 font-bold">{t('cefr_assessment')}</p>
                    <div className="mt-4 flex justify-between text-[10px] font-bold opacity-30">
                      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lv => (
                        <span key={lv} className={assessment.cefrLevel.includes(lv) ? 'text-[#1D41DB] opacity-100 scale-125' : ''}>{lv}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setScreen('LANGUAGE_SELECT')}
                  className="w-full py-4 bg-white rounded-2xl border border-black/5 hover:bg-[#F5F5F0] transition-colors flex items-center justify-center gap-2 font-bold text-[#1D41DB]"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('new_session')}
                </button>
              </div>

              <div className="md:col-span-3 space-y-8">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1D41DB]">
                      <MessageSquare className="w-5 h-5 text-[#1D41DB]" />
                      {t('transcript')}
                    </h3>
                    {audioUrl && (
                      <button 
                        onClick={() => new Audio(audioUrl).play()}
                        className="flex items-center gap-2 text-sm text-[#1D41DB] hover:underline font-bold"
                      >
                        <Play className="w-4 h-4" />
                        {t('listen_again')}
                      </button>
                    )}
                  </div>
                  <p className="text-lg leading-relaxed italic text-gray-700 bg-[#F5F5F0] p-6 rounded-2xl">
                    "{assessment.transcript}"
                  </p>
                </div>

                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1D41DB]">
                      <Award className="w-5 h-5 text-[#1D41DB]" />
                      Valoración global del nivel
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 bg-[#F5F5F0] p-6 rounded-2xl">
                    {assessment.globalAssessment}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'eficacia', labelKey: 'effectiveness', icon: CheckCircle2, color: 'green' },
                    { key: 'coherencia', labelKey: 'organization', icon: Award, color: 'blue' },
                    { key: 'correccion', labelKey: 'accuracy', icon: AlertCircle, color: 'red' },
                    { key: 'alcance', labelKey: 'richness', icon: RefreshCw, color: 'purple' },
                    { key: 'fonologia', labelKey: 'phonology', icon: Mic, color: 'orange' },
                  ].map((item) => {
                    const data = (assessment.criteriaFeedback as any)[item.key];
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold flex items-center gap-2 text-[#1D41DB]">
                            <Icon className={`w-5 h-5 text-${item.color}-500`} />
                            {t(item.labelKey)}
                          </h4>
                          <span className={`text-sm font-bold bg-${item.color}-100 text-${item.color}-700 px-2 py-1 rounded-lg`}>
                            Banda {data.score}
                          </span>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed">{data.feedback}</p>
                      </div>
                    );
                  })}
                </div>

                {assessment.noCumpleTarea && (
                  <div className="bg-red-50 border border-red-200 p-6 rounded-[32px] text-red-700 flex items-center gap-4">
                    <AlertCircle className="w-8 h-8" />
                    <p className="font-bold text-lg">No cumple la tarea: El audio proporcionado no se ajusta a los requisitos de la actividad.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
