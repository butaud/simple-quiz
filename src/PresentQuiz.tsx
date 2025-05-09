import { Resolved } from "jazz-tools";
import { LiveSession } from "./schema";
import { allAnswered, getCurrentQuestion } from "./util/model";
import { Scoreboard } from "./Scoreboard";

export type PresentQuizProps = {
  liveSession: Resolved<
    LiveSession,
    {
      answered: { $each: true };
      quiz: {
        questions: { $each: true };
      };
      entries: {
        $each: {
          account: { profile: true };
          answers: { $each: { question: true } };
        };
      };
    }
  >;
};

export const PresentQuiz = ({ liveSession }: PresentQuizProps) => {
  const currentQuestion = getCurrentQuestion(liveSession);
  const areAllAnswered = allAnswered(liveSession);

  if (currentQuestion === null) {
    return <p>Loading...</p>;
  }

  const advance = () => {
    if (liveSession.showingAnswer) {
      liveSession.showingAnswer = false;
    } else {
      liveSession.answered.push(currentQuestion);
      liveSession.showingAnswer = true;
    }
  };

  if (areAllAnswered && !liveSession.showingAnswer) {
    return (
      <>
        <h3>Results</h3>
        <Scoreboard liveSession={liveSession} final />
      </>
    );
  }

  return (
    <>
      <h3>{currentQuestion.question}</h3>
      {liveSession.showingAnswer ? (
        <p>The correct answer was: {currentQuestion.correctAnswer}</p>
      ) : (
        <p>Record your answers now!</p>
      )}
      <button onClick={advance}>
        {areAllAnswered
          ? "Show results"
          : liveSession.showingAnswer
          ? "Next question"
          : "Reveal answer"}
      </button>
    </>
  );
};
