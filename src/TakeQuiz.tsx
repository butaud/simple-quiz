import { Resolved } from "jazz-tools";
import { Answer, Entry, LiveSession, Quiz, QuizQuestion } from "./schema";
import { useState } from "react";

import "./TakeQuiz.css";
import { allAnswered, getCurrentQuestion } from "./util/model";

export type TakeQuizProps = {
  quiz: Resolved<Quiz, { questions: { $each: true } }>;
  entry: Resolved<
    Entry,
    {
      answers: { $each: { question: true } };
      currentQuestion: true;
      liveSession: {
        answered: { $each: { question: true } };
        quiz: {
          questions: { $each: true };
        };
      };
      quiz: {
        questions: { $each: true };
      };
    }
  >;
  reset: () => void;
};

export const TakeQuiz = ({ quiz, entry, reset }: TakeQuizProps) => {
  const currentQuestion = entry.liveSession
    ? getCurrentQuestion(entry.liveSession)
    : entry.quiz.questions[entry.currentQuestionIndex];
  const allFinished = entry.liveSession
    ? allAnswered(entry.liveSession) && !entry.liveSession.showingAnswer
    : entry.answers.length === quiz.questions.length;

  if (allFinished || !currentQuestion) {
    return <QuizFinish entry={entry} quiz={quiz} reset={reset} />;
  }

  return (
    <div className="take-quiz">
      <div className="toc">
        <ul>
          {quiz.questions.map((question, index) => (
            <QuizTocItem
              key={index}
              entry={entry}
              index={index}
              question={question}
            />
          ))}
        </ul>
      </div>

      <QuizQuestionC
        question={currentQuestion}
        entry={entry}
        answer={entry.answers.find((a) => a.question.id === currentQuestion.id)}
        index={entry.currentQuestionIndex}
        totalQuestions={quiz.questions.length}
      />
    </div>
  );
};

type QuizTocItemProps = {
  index: number;
  question: Resolved<QuizQuestion, true>;
  entry: Resolved<
    Entry,
    {
      answers: { $each: { question: true } };
      currentQuestion: true;
      liveSession: {
        answered: { $each: { question: true } };
        quiz: {
          questions: { $each: true };
        };
      };
      quiz: {
        questions: { $each: true };
      };
    }
  >;
};

export const QuizTocItem = ({ index, question, entry }: QuizTocItemProps) => {
  const currentQuestion = entry.liveSession
    ? getCurrentQuestion(entry.liveSession)
    : entry.quiz.questions[entry.currentQuestionIndex];
  const isActive = currentQuestion?.id === question.id;
  const answer = entry.answers.find((a) => a.question.id === question.id);
  const onClick = () => {
    entry.currentQuestion = question;
  };
  let displayText = `${index + 1}`;
  if (
    answer &&
    !(entry.liveSession && isActive && !entry.liveSession.showingAnswer)
  ) {
    displayText += `: ${
      answer.answer === question.correctAnswer ? "✅" : "❌"
    }`;
  }
  return (
    <li>
      {isActive || entry.liveSession ? (
        <span title={question.question}>{displayText}</span>
      ) : (
        <button onClick={onClick} title={question.question} className="subtle">
          {displayText}
        </button>
      )}
    </li>
  );
};

type QuizQuestionCProps = {
  question: Resolved<QuizQuestion, true>;
  entry: Resolved<Entry, { answers: true; liveSession: true }>;
  answer: Resolved<Answer, true> | undefined;
  index: number;
  totalQuestions: number;
};

const QuizQuestionC = ({
  question,
  answer,
  entry,
  index,
  totalQuestions,
}: QuizQuestionCProps) => {
  const isFirstQuestion = index === 0;
  const isLastQuestion = index === totalQuestions - 1;

  return (
    <div className="question">
      <h3>{question.question}</h3>
      {answer || entry.liveSession?.showingAnswer ? (
        <QuestionAnswerC
          answer={answer}
          correctAnswer={question.correctAnswer}
          liveSession={entry.liveSession}
        />
      ) : (
        <QuestionAnswerEditor entry={entry} question={question} />
      )}
      {!entry.liveSession && (
        <div className="navigation">
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => {
              entry.currentQuestion = entry.quiz?.questions?.[index - 1];
            }}
          >
            {"<< Previous"}
          </button>
          <button
            type="button"
            disabled={isLastQuestion}
            onClick={() => {
              entry.currentQuestion = entry.quiz?.questions?.[index + 1];
            }}
          >
            {"Next >>"}
          </button>
        </div>
      )}
    </div>
  );
};

type QuestionAnswerCProps = {
  answer: Resolved<Answer, true> | undefined;
  correctAnswer: string;
  liveSession: LiveSession | undefined;
};

const QuestionAnswerC = ({
  answer,
  correctAnswer,
  liveSession,
}: QuestionAnswerCProps) => {
  if (liveSession?.showingAnswer) {
    return (
      <>
        {answer ? (
          <p>
            Your answer: {answer.answer}{" "}
            {answer.answer === correctAnswer ? "✅" : "❌"}
          </p>
        ) : (
          <p>You didn't answer this question.</p>
        )}
        <p>The correct answer was: {correctAnswer}</p>
      </>
    );
  } else if (liveSession && answer) {
    return <p>Your answer is locked in: {answer.answer}</p>;
  } else if (answer) {
    return (
      <p>
        Your answer: {answer.answer}{" "}
        {answer.answer === correctAnswer ? "✅" : "❌"}
      </p>
    );
  }
};

type QuestionAnswerEditorProps = {
  entry: Resolved<Entry, { answers: true }>;
  question: QuizQuestion;
};

const QuestionAnswerEditor = ({
  entry,
  question,
}: QuestionAnswerEditorProps) => {
  const [newAnswer, setNewAnswer] = useState("");
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        Your answer:
        <input
          type="text"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
      </label>
      <button
        onClick={() => {
          entry.answers.push(
            Answer.create(
              {
                question,
                answer: newAnswer.trim(),
              },
              entry._owner
            )
          );
          setNewAnswer("");
        }}
      >
        Submit
      </button>
    </form>
  );
};

type QuizFinishProps = {
  entry: Resolved<Entry, { answers: { $each: { question: true } } }>;
  quiz: Resolved<Quiz, { questions: { $each: true } }>;
  reset: () => void;
};
export const QuizFinish = ({ entry, quiz, reset }: QuizFinishProps) => {
  const correctAnswers = entry.answers.filter(
    (a) => a.answer === a.question.correctAnswer
  );
  const totalQuestions = quiz.questions.length;
  const score = (correctAnswers.length / totalQuestions) * 100;
  return (
    <div className="quiz-finish">
      <h2>Quiz Finished!</h2>
      <p>
        You answered {correctAnswers.length} out of {totalQuestions} questions
        correctly.
      </p>
      <p>Your score: {score.toFixed(2)}%</p>
      <h3>Answers</h3>
      <ul className="results">
        {quiz.questions.map((question) => {
          const answer = entry.answers.find(
            (a) => a.question.id === question.id
          );
          return (
            <li key={question.id}>
              <strong>{question.question}</strong>: {answer?.answer}{" "}
              {answer ? (
                answer.answer === answer.question.correctAnswer ? (
                  "✅"
                ) : (
                  "❌"
                )
              ) : (
                <span className="skipped">Skipped</span>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={reset}>
        Take the quiz again
      </button>
    </div>
  );
};
