import { ProfileButton } from "./ProfileButton.tsx";

import "./App.css";
import { Homepage } from "./Homepage.tsx";

function App() {
  return (
    <>
      <header>
        <nav>
          <h1>Simple Quiz</h1>
          <ProfileButton />
        </nav>
      </header>
      <main>
        <Homepage />
      </main>
    </>
  );
}

export default App;
