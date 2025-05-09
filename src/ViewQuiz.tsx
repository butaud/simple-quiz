import { useNavigate, useParams } from "react-router-dom";
import "./EditQuiz.css";
import { useAccount, useCoState } from "jazz-react";
import { Quiz } from "./schema";
import { ID } from "jazz-tools";
import { useEffect } from "react";

export const ViewQuiz = () => {
  const { me } = useAccount({
    resolve: {
      root: { participantQuizzes: { $each: true } },
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const quiz = useCoState<Quiz>(Quiz, id as ID<Quiz>, {
    resolve: {
      title: true,
    },
  });

  if (!id) {
    navigate("/");
  }
  if (!me || !quiz) return null;

  useEffect(() => {
    if (!me.root.participantQuizzes.some((q) => q.id === id)) {
      me.root.participantQuizzes.push(quiz);
    }
  }, [me, quiz, id]);

  return (
    <div className="view-quiz">
      <h2>{quiz.title}</h2>
    </div>
  );
};
