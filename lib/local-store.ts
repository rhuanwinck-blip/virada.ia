import { AnswerMap } from "@/lib/questions";

const answersKey = "virada.answers";
const contactKey = "virada.contact";
const progressKey = "virada.progress";

export type ContactLead = {
  name: string;
  email: string;
  ageRange: string;
  mainPain: string;
  marketingConsent: boolean;
};

export function saveAnswers(answers: AnswerMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(answersKey, JSON.stringify(answers));
}

export function loadAnswers(): AnswerMap | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(answersKey);
  return raw ? (JSON.parse(raw) as AnswerMap) : null;
}

export function saveContact(contact: ContactLead) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(contactKey, JSON.stringify(contact));
}

export function loadContact(): ContactLead | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(contactKey);
  return raw ? (JSON.parse(raw) as ContactLead) : null;
}

export function toggleProgress(day: number) {
  if (typeof window === "undefined") return [];
  const current = loadProgress();
  const next = current.includes(day) ? current.filter((item) => item !== day) : [...current, day];
  window.localStorage.setItem(progressKey, JSON.stringify(next));
  return next;
}

export function loadProgress(): number[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(progressKey);
  return raw ? (JSON.parse(raw) as number[]) : [];
}
