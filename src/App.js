import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header/Header';
import MainPage from './pages/MainPage/MainPage';
import NotFound from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">

        <div className="wrapper">
          <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;