import { useNavigate, useParams } from "react-router-dom";
import "./EditQuiz.css";
import { useAccount, useCoState } from "jazz-react";
import { Quiz, QuizQuestion } from "./schema";
import { ID } from "jazz-tools";

export const EditQuiz = () => {
  const { me } = useAccount({
    resolve: {
      root: { ownerQuizzes: { $each: true } },
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const quiz = useCoState(Quiz, id as ID<Quiz>, {
    resolve: {
      questions: {
        $each: true,
      },
    },
  });

  if (!me || !quiz) return null;
  if (!id) {
    navigate("/");
  }

  if (!me.root.ownerQuizzes.some((q) => q.id === id)) {
    return <p>You don't appear to own this quiz.</p>;
  }

  return (
    <div className="edit-quiz">
      <h2>Edit a Quiz</h2>
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
