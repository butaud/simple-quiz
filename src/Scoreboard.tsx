import { Resolved } from "jazz-tools";
import { LiveSession } from "./schema";
import { calculateScore } from "./util/model";
import { Avatar } from "./Avatar";

import "./Scoreboard.css";

export type ScoreboardProps = {
  liveSession: Resolved<
    LiveSession,
    {
      entries: {
        $each: {
          account: { profile: true };
          answers: { $each: { question: true } };
        };
      };
    }
  >;
};

export const Scoreboard = ({ liveSession }: ScoreboardProps) => {
  const entriesWithScores = liveSession.entries.map((entry) => ({
    ...entry,
    score: calculateScore(entry),
  }));
  const rankedEntries = entriesWithScores.sort((a, b) => {
    return b.score - a.score;
  });
  return (
    <div className="scoreboard">
      <h3>Scoreboard</h3>
      <ul>
        {rankedEntries.map((entry) => (
          <li key={entry.id} className="scoreboard-entry">
            <Avatar profile={entry.account.profile} as="div" size="small" />{" "}
            <span className="score">
              {entry.score} {entry.score === 1 ? "point" : "points"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
