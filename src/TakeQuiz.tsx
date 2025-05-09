import { Resolved } from "jazz-tools";
import { Answer, Entry, Quiz, QuizQuestion } from "./schema";
import { useState } from "react";

import "./TakeQuiz.css";

export type TakeQuizProps = {
  quiz: Resolved<Quiz, { questions: { $each: true } }>;
  entry: Resolved<
    Entry,
    { answers: { $each: { question: true } }; currentQuestion: true }
  >;
  reset: () => void;
};

export const TakeQuiz = ({ quiz, entry, reset }: TakeQuizProps) => {
  const currentQuestion = quiz.questions[entry.currentQuestionIndex];
  const allFinished = entry.answers.length === quiz.questions.length;

  if (allFinished) {
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
    { answers: { $each: { question: true } }; currentQuestion: true }
  >;
};

export const QuizTocItem = ({ index, question, entry }: QuizTocItemProps) => {
  const isActive = entry.currentQuestion?.id === question.id;
  const answer = entry.answers.find((a) => a.question.id === question.id);
  const onClick = () => {
    entry.currentQuestion = question;
  };
  let displayText = `${index + 1}`;
  if (answer) {
    displayText += `: ${
      answer.answer === question.correctAnswer ? "✅" : "❌"
    }`;
  }
  return (
    <li>
      {isActive ? (
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
  entry: Resolved<Entry, { answers: true }>;
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
  const [newAnswer, setNewAnswer] = useState("");

  const isFirstQuestion = index === 0;
  const isLastQuestion = index === totalQuestions - 1;

  return (
    <div className="question">
      <h3>{question.question}</h3>
      {answer && (
        <p>
          Your answer: {answer.answer}{" "}
          {answer.answer === question.correctAnswer ? "✅" : "❌"}
        </p>
      )}
      {!answer && (
        <form>
          <label>
            Your answer:
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              entry.answers.push(
                Answer.create({
                  question: question,
                  answer: newAnswer.trim(),
                })
              );
              setNewAnswer("");
            }}
          >
            Submit
          </button>
        </form>
      )}
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
    </div>
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
      <ul>
        {entry.answers.map((answer) => (
          <li key={answer.question.id}>
            <strong>{answer.question.question}</strong>: {answer.answer}{" "}
            {answer.answer === answer.question.correctAnswer ? "✅" : "❌"}
          </li>
        ))}
      </ul>
      <button type="button" onClick={reset}>
        Take the quiz again
      </button>
    </div>
  );
};
