import { useAccount } from "jazz-react";
import { Form } from "./Form.tsx";
import { Logo } from "./Logo.tsx";
import { ProfileButton } from "./ProfileButton.tsx";

import "./App.css";

function App() {
  const { me } = useAccount({ resolve: { profile: true, root: true } });

  return (
    <>
      <header>
        <nav>
          <h1>Simple Quiz</h1>
          <ProfileButton />
        </nav>
      </header>
      <main className="container mt-16 flex flex-col gap-8">
        <Logo />

        <div className="text-center">
          <h1>Welcome{me?.profile.name ? <>, {me?.profile.name}</> : ""}!</h1>
        </div>

        <Form />

        <p className="text-center">
          Edit the form above,{" "}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-semibold underline"
          >
            refresh
          </button>{" "}
          this page, and see your changes persist.
        </p>

        <p className="text-center">
          Edit <code className="font-semibold">schema.ts</code> to add more
          fields.
        </p>

        <p className="text-center my-16">
          Go to{" "}
          <a
            className="font-semibold underline"
            href="https://jazz.tools/docs/react/guide"
          >
            jazz.tools/docs/react/guide
          </a>{" "}
          for a full tutorial.
        </p>
      </main>
    </>
  );
}

export default App;
