import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import MainPage from "./pages/MainPage/MainPage";
import ReportPage from "./pages/ReportPage/ReportPage";
import ReportsPage from "./pages/ReportsPage/ReportsPage";
import AdminPanelPage from "./pages/AdminPanelPage/AdminPanelPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChangelogsPage from "./pages/ChangelogsPage/ChangelogsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <div className="wrapper">
            <Header />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPanelPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/changelogs" element={<ChangelogsPage />} />
              <Route path="/reports/:id" element={<ReportPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
