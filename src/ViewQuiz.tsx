import { useNavigate, useParams } from "react-router-dom";
import "./EditQuiz.css";
import { useAccount, useCoState } from "jazz-react";
import { Entry, ListOfAnswers, LiveSession, Quiz } from "./schema";
import { Group, ID } from "jazz-tools";
import { useEffect } from "react";
import { TakeQuiz } from "./TakeQuiz";

export const ViewQuiz = () => {
  const { me } = useAccount({
    resolve: {
      root: {
        participantQuizzes: { $each: true },
        entries: {
          $each: {
            answers: { $each: { question: true } },
            currentQuestion: true,
            liveSession: {
              answered: { $each: { question: true } },
              quiz: {
                questions: { $each: true },
              },
            },
            quiz: {
              questions: { $each: true },
            },
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
      currentLiveSession: {
        entries: true,
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

  const entry = me.root.entries.find((e) => e?.quiz?.id === id && !e.archived);

  const createEntry = (liveSession?: LiveSession) => {
    const group = Group.create();
    if (liveSession) {
      group.addMember("everyone", "reader");
    }
    const newEntry = Entry.create(
      {
        account: me,
        quiz: quiz,
        answers: ListOfAnswers.create([], group),
        liveSession,
      },
      group
    );
    me.root.entries.push(newEntry);
    return newEntry;
  };

  const takeQuiz = () => {
    if (!entry) {
      createEntry();
    }
  };

  const joinLiveSession = () => {
    if (entry) {
      entry.archived = true;
    }
    if (quiz.currentLiveSession) {
      const newEntry = createEntry(quiz.currentLiveSession);
      quiz.currentLiveSession.entries.push(newEntry);
    }
  };

  const reset = () => {
    if (entry) {
      entry.archived = true;
      createEntry();
    }
  };

  return (
    <div className="view-quiz">
      <h2>{quiz.title}</h2>
      {!entry && <button onClick={takeQuiz}>Take Quiz</button>}
      {quiz.currentLiveSession && !entry?.liveSession && (
        <button onClick={joinLiveSession}>Join Live Session</button>
      )}
      {entry && <TakeQuiz entry={entry} quiz={quiz} reset={reset} />}
    </div>
  );
};
