import { Routes, Route } from "react-router-dom";
import AdminPage from "./pages/Admin/page";
import Header from "./components/Header/Header";
import "./index.css";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
