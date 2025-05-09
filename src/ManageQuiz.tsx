import { useAccount, useCoState } from "jazz-react";
import { Group, ID } from "jazz-tools";
import { useParams, useNavigate } from "react-router-dom";
import {
  ListOfEntries,
  ListOfQuizQuestions,
  LiveSession,
  Quiz,
} from "./schema";
import { EditQuiz } from "./EditQuiz";
import { PresentQuiz } from "./PresentQuiz";

export const ManageQuiz = () => {
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
      liveSessions: true,
      currentLiveSession: {
        entries: {
          $each: {
            account: {
              profile: true,
            },
            answers: {
              $each: {
                question: true,
              },
            },
          },
        },
        answered: {
          $each: {
            question: true,
          },
        },
        quiz: {
          questions: {
            $each: true,
          },
        },
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

  const endLiveSession = () => {
    if (
      confirm(
        "Are you sure you want to end the live session? It can't be resumed."
      )
    ) {
      delete quiz.currentLiveSession;
    }
  };

  const startLiveSession = () => {
    if (!quiz.currentLiveSession) {
      const allReaderGroup = Group.create();
      allReaderGroup.addMember("everyone", "reader");

      const allWriterGroup = Group.create();
      allWriterGroup.addMember("everyone", "writer");

      const newLiveSession = LiveSession.create(
        {
          quiz,
          entries: ListOfEntries.create([], allWriterGroup),
          answered: ListOfQuizQuestions.create([], allReaderGroup),
          startTime: new Date(),
          showingAnswer: false,
        },
        allReaderGroup
      );
      quiz.liveSessions.push(newLiveSession);
      (quiz as Quiz).currentLiveSession = newLiveSession;
    }
  };

  if (quiz.currentLiveSession) {
    return (
      <div>
        <h2>Live Session</h2>
        <button onClick={endLiveSession}>End Session</button>
        <PresentQuiz liveSession={quiz.currentLiveSession} />
      </div>
    );
  } else {
    return <EditQuiz quiz={quiz} onStartLiveSession={startLiveSession} />;
  }
};
