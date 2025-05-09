import { useNavigate, useParams } from "react-router-dom";
import "./EditQuiz.css";
import { useAccount, useCoState } from "jazz-react";
import { Quiz } from "./schema";
import { ID } from "jazz-tools";

export const EditQuiz = () => {
  const { me } = useAccount({
    resolve: {
      root: { ownerQuizzes: { $each: true } },
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const quiz = useCoState<Quiz>(Quiz, id as ID<Quiz>, {
    resolve: {
      title: true,
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
    </div>
  );
};
