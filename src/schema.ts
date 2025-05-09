/**
 * Learn about schemas here:
 * https://jazz.tools/docs/react/schemas/covalues
 */

import { Account, CoList, CoMap, Group, Profile, co } from "jazz-tools";

export class QuizQuestion extends CoMap {
  question = co.string;
  correctAnswer = co.string;
}

export class ListOfQuizQuestions extends CoList.Of(co.ref(QuizQuestion)) {}

export class Answer extends CoMap {
  question = co.ref(QuizQuestion);
  answer = co.string;
}

export class ListOfAnswers extends CoList.Of(co.ref(Answer)) {}

export class Entry extends CoMap {
  account = co.ref(JazzAccount);
  quiz = co.ref(Quiz);
  answers = co.ref(ListOfAnswers);
  currentQuestion = co.optional.ref(QuizQuestion);

  get currentQuestionIndex() {
    if (!this.currentQuestion) return 0;
    const index =
      this.quiz?.questions?.findIndex(
        (q) => q?.id === this.currentQuestion?.id
      ) ?? 0;
    return index === -1 ? 0 : index;
  }
}

export class ListOfEntries extends CoList.Of(co.ref(Entry)) {}

export class Quiz extends CoMap {
  title = co.string;
  questions = co.ref(ListOfQuizQuestions);
}

export class ListOfQuizzes extends CoList.Of(co.ref(Quiz)) {}

export const AVATAR_COLORS = [
  "#3D3D3D", // dark gray
  "#FF5733", // reddish orange
  "#33FF57", // bright green
  "#3357FF", // vivid blue
  "#FF33A6", // hot pink
  "#33FFF6", // aqua
  "#8D33FF", // purple
  "#FFC733", // gold
  "#33FF8A", // mint green
  "#FF3333", // bright red
  "#3375FF", // medium blue
  "#FF8C33", // orange
  "#33D1FF", // sky blue
  "#A6FF33", // lime
  "#FF33F6", // magenta
];

/** The account profile is an app-specific per-user public `CoMap`
 *  where you can store top-level objects for that user */
export class JazzProfile extends Profile {
  /**
   * Learn about CoValue field/item types here:
   * https://jazz.tools/docs/react/schemas/covalues#covalue-fielditem-types
   */
  name = co.string;

  color = co.optional.literal(...AVATAR_COLORS);

  get avatarColor() {
    if (!this.color) {
      this.color =
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    }
    return this.color;
  }

  // Add public fields here
}

/** The account root is an app-specific per-user private `CoMap`
 *  where you can store top-level objects for that user */
export class AccountRoot extends CoMap {
  ownerQuizzes = co.ref(ListOfQuizzes);
  participantQuizzes = co.ref(ListOfQuizzes);
  entries = co.ref(ListOfEntries);
}

export class JazzAccount extends Account {
  profile = co.ref(JazzProfile);
  root = co.ref(AccountRoot);

  /** The account migration is run on account creation and on every log-in.
   *  You can use it to set up the account root and any other initial CoValues you need.
   */
  migrate(this: JazzAccount) {
    if (this.root === undefined) {
      const group = Group.create();
      this.root = AccountRoot.create(
        {
          ownerQuizzes: ListOfQuizzes.create([]),
          participantQuizzes: ListOfQuizzes.create([]),
          entries: ListOfEntries.create([], group),
        },
        group
      );
    } else if (this.root && this.root.entries === undefined) {
      // If the entries list is not defined, create it
      const group = Group.create();
      this.root.entries = ListOfEntries.create([], group);
    }

    // If the profile is not defined, create it with a random color

    if (this.profile === undefined) {
      const group = Group.create();
      group.addMember("everyone", "reader"); // The profile info is visible to everyone

      this.profile = JazzProfile.create(
        {
          name: "Anonymous user",
          avatarColor:
            AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        },
        group
      );
    }
  }
}
