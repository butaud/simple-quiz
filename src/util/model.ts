/*
export type PresentQuizProps = {
  quiz: Resolved<Quiz, { questions: { $each: true } }>;
  liveSession: Resolved<LiveSession, { answered: { $each: true } }>;
};

export const PresentQuiz = ({ quiz, liveSession }: PresentQuizProps) => {
  const lastAnsweredQuestion =
    liveSession.answered[liveSession.answered.length - 1];
  const nextUnansweredQuestion =
    quiz.questions.filter(
      (q) => !liveSession.answered.some((a) => a.id === q.id)
    )[0] || undefined;
  const allAnswered = liveSession.answered.length === quiz.questions.length;
  const currentQuestion = liveSession.showingAnswer
    ? lastAnsweredQuestion
    : nextUnansweredQuestion;*/

import { Resolved } from "jazz-tools";
import { Entry, LiveSession } from "../schema";

export const getLastAnsweredQuestion = (
  liveSession: Resolved<
    LiveSession,
    {
      answered: { $each: true };
      quiz: {
        questions: { $each: true };
      };
    }
  >
) => {
  return liveSession.answered[liveSession.answered.length - 1];
};

export const getNextUnansweredQuestion = (
  liveSession: Resolved<
    LiveSession,
    {
      answered: { $each: true };
      quiz: {
        questions: { $each: true };
      };
    }
  >
) => {
  return (
    liveSession.quiz.questions.filter(
      (q) => !liveSession.answered.some((a) => a.id === q.id)
    )[0] || undefined
  );
};

export const allAnswered = (
  liveSession: Resolved<
    LiveSession,
    {
      answered: { $each: true };
      quiz: {
        questions: { $each: true };
      };
    }
  >
) => {
  return liveSession.answered.length === liveSession.quiz.questions.length;
};

export const getCurrentQuestion = (
  liveSession: Resolved<
    LiveSession,
    {
      answered: { $each: true };
      quiz: {
        questions: { $each: true };
      };
    }
  >
) => {
  return liveSession.showingAnswer
    ? getLastAnsweredQuestion(liveSession)
    : getNextUnansweredQuestion(liveSession);
};

export const calculateScore = (
  entry: Resolved<Entry, { answers: { $each: { question: true } } }>
) => {
  return entry.answers.reduce((score, answer) => {
    if (answer.answer === answer.question.correctAnswer) {
      return score + 1;
    } else {
      return score;
    }
  }, 0);
};
