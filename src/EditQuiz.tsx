import "./EditQuiz.css";
import { Quiz, QuizQuestion } from "./schema";
import { Resolved } from "jazz-tools";
import { FC } from "react";

export type EditQuizProps = {
  quiz: Resolved<Quiz, { questions: { $each: true } }>;
  onStartLiveSession: () => void;
};

export const EditQuiz: FC<EditQuizProps> = ({ quiz, onStartLiveSession }) => {
  return (
    <div className="edit-quiz">
      <h2>Edit a Quiz</h2>
      <button type="button" onClick={onStartLiveSession}>
        Start Live Session
      </button>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Quiz Title:
          <input
            type="text"
            name="title"
            value={quiz.title}
            onChange={(e) => (quiz.title = e.currentTarget.value)}
          />
        </label>
      </form>
      <h3>Questions</h3>
      <ol>
        {quiz.questions.map((question, index) => (
          <li key={index}>
            <label>
              Question:
              <input
                type="text"
                value={question.question}
                onChange={(e) => {
                  question.question = e.currentTarget.value;
                }}
              />
            </label>
            <label>
              Correct Answer:
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => {
                  question.correctAnswer = e.currentTarget.value;
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                quiz.questions.splice(index, 1);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => {
          const question = QuizQuestion.create(
            {
              question: "",
              correctAnswer: "",
            },
            quiz._owner
          );
          quiz.questions.push(question);
        }}
      >
        Add Question
      </button>
    </div>
  );
};
