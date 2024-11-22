import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreatePage } from './pages/CreatePage';
import { ViewPage } from './pages/ViewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatePage />} />
        <Route path="/:id" element={<ViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}