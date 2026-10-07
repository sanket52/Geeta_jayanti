export const QUESTION_BANK_KEY = "mpvvg_question_bank_v2";
export const QUESTION_BANK_UPDATED_EVENT = "mpvvg:question-bank-updated";

export type QuestionStatus = "Published" | "Draft";

export type Question = {
  id: number;
  question: string;
  subject: string;
  difficulty: string;
  marks: number;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  status: QuestionStatus;
};

export const initialQuestions: Question[] = [
  { id: 1, question: "Who composed the Ashtadhyayi?", subject: "Sanskrit", difficulty: "Easy", marks: 1, optionA: "Panini", optionB: "Patanjali", optionC: "Kalidasa", optionD: "Valmiki", answer: "A", status: "Published" },
  { id: 2, question: "How many chapters are traditionally identified in the Rigveda?", subject: "Vedas", difficulty: "Medium", marks: 1, optionA: "Eight", optionB: "Ten", optionC: "Twelve", optionD: "Sixteen", answer: "B", status: "Published" },
  { id: 3, question: "Which Vedanga deals primarily with grammar?", subject: "Vedangas", difficulty: "Easy", marks: 1, optionA: "Nirukta", optionB: "Chandas", optionC: "Vyakarana", optionD: "Kalpa", answer: "C", status: "Published" },
  { id: 4, question: "What is the principal subject of the Samaveda?", subject: "Vedas", difficulty: "Medium", marks: 2, optionA: "Medicine", optionB: "Music and chants", optionC: "Astronomy", optionD: "Statecraft", answer: "B", status: "Draft" },
  { id: 5, question: "Identify the correct meaning of the term Upanishad.", subject: "Indian Culture", difficulty: "Hard", marks: 2, optionA: "Sitting near a teacher", optionB: "Daily ritual", optionC: "Sacred journey", optionD: "Temple offering", answer: "A", status: "Draft" },
];

export function getQuestions(): Question[] {
  try {
    const stored = window.localStorage.getItem(QUESTION_BANK_KEY);
    if (stored) return JSON.parse(stored);
    saveQuestions(initialQuestions);
    return initialQuestions;
  } catch {
    return initialQuestions;
  }
}

export function saveQuestions(questions: Question[]) {
  window.localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(questions));
  window.dispatchEvent(new CustomEvent(QUESTION_BANK_UPDATED_EVENT));
}

export function getPublishedQuestions() {
  return getQuestions().filter((question) => question.status === "Published");
}

export function subscribeToQuestions(callback: () => void) {
  window.addEventListener(QUESTION_BANK_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(QUESTION_BANK_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
