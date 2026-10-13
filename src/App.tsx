import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import EditorPage from './pages/EditorPage'
import PrintPage from './pages/PrintPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/print/:id" element={<PrintPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
