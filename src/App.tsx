import { ProfileButton } from "./ProfileButton.tsx";

import "./App.css";
import { Homepage } from "./Homepage.tsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import { EditQuiz } from "./EditQuiz.tsx";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <header>
        <nav>
          <h1 onClick={() => navigate("/")}>Simple Quiz</h1>
          <ProfileButton />
        </nav>
      </header>
      <main>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="/quiz/:id" element={<div>Quiz</div>} />
          <Route path="/quiz/edit/:id" element={<EditQuiz />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
