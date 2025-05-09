import { useAccount } from "jazz-react";
import { useState } from "react";

export const Homepage = () => {
  const { me } = useAccount({
    resolve: {
      profile: true,
      root: {
        ownerQuizzes: { $each: true },
        participantQuizzes: { $each: true },
      },
    },
  });

  const [quizId, setQuizId] = useState("");

  if (!me) return null;
  return (
    <>
      <h2>Quizzes you own</h2>
      {me?.root?.ownerQuizzes?.length === 0 && (
        <p>You don't own any quizzes yet. Create one to get started!</p>
      )}
      {me.root.ownerQuizzes.length > 0 && (
        <ul>
          {me.root.ownerQuizzes.map((quiz) => (
            <li key={quiz.id}>
              <a href={`/quiz/${quiz.id}`}>{quiz.title}</a>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => {
          window.history.pushState({}, "", "/create");
        }}
      >
        Create a new quiz
      </button>
      <h2>Quizzes you are participating in</h2>
      {me?.root?.participantQuizzes?.length === 0 && (
        <p>You are not participating in any quizzes yet.</p>
      )}
      {me.root.participantQuizzes.length > 0 && (
        <ul>
          {me.root.participantQuizzes.map((quiz) => (
            <li key={quiz.id}>
              <a href={`/quiz/${quiz.id}`}>{quiz.title}</a>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Quiz id</span>
          <input
            type="text"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
        </label>
        <button
          disabled={!quizId || quizId.length < 5}
          onClick={() => {
            window.history.pushState({}, "", `/quiz/${quizId}`);
          }}
        >
          Join a quiz
        </button>
      </form>
    </>
  );
};
