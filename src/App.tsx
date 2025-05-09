import { ProfileButton } from "./ProfileButton.tsx";

import "./App.css";
import { Homepage } from "./Homepage.tsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ViewQuiz } from "./ViewQuiz.tsx";
import { ManageQuiz } from "./ManageQuiz.tsx";

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
          <Route path="/quiz/:id" element={<ViewQuiz />} />
          <Route path="/quiz/edit/:id" element={<ManageQuiz />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
