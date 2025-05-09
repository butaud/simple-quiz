import { useNavigate, useParams } from "react-router-dom";
import "./EditQuiz.css";
import { useAccount, useCoState } from "jazz-react";
import { Entry, ListOfAnswers, Quiz } from "./schema";
import { ID } from "jazz-tools";
import { useEffect } from "react";
import { TakeQuiz } from "./TakeQuiz";

export const ViewQuiz = () => {
  const { me } = useAccount({
    resolve: {
      root: {
        participantQuizzes: { $each: true },
        entries: {
          $each: {
            quiz: true,
            answers: { $each: { question: true } },
            currentQuestion: true,
          },
        },
      },
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

  useEffect(() => {
    if (
      quiz &&
      me?.root.participantQuizzes.some((q) => q.id === id) === false
    ) {
      me.root.participantQuizzes.push(quiz);
    }
  }, [me, quiz, id]);

  if (!id) {
    navigate("/");
  }
  if (!me || !quiz) return null;

  const entry = me.root.entries.find((e) => e.quiz.id === id);

  const createEntry = () => {
    const newEntry = Entry.create({
      account: me,
      quiz: quiz,
      answers: ListOfAnswers.create([]),
    });
    me.root.entries.push(newEntry);
  };

  const takeQuiz = () => {
    if (!entry) {
      createEntry();
    }
  };

  const reset = () => {
    if (entry) {
      me.root.entries.splice(
        me.root.entries.findIndex((e) => e.id === entry.id),
        1
      );
      createEntry();
    }
  };

  return (
    <div className="view-quiz">
      <h2>{quiz.title}</h2>
      {!entry && <button onClick={takeQuiz}>Take Quiz</button>}
      {entry && <TakeQuiz entry={entry} quiz={quiz} reset={reset} />}
    </div>
  );
};
