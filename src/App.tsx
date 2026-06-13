import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudyHub } from './pages/StudyHub';
import { LessonPage } from './pages/LessonPage';
import { Practice } from './pages/Practice';
import { MockList } from './pages/MockList';
import { MockRunner } from './pages/MockRunner';
import { Flashcards } from './pages/Flashcards';
import { ProgressPage } from './pages/ProgressPage';
import { Reference } from './pages/Reference';
import { Settings } from './pages/Settings';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="study" element={<StudyHub />} />
          <Route path="study/:examId" element={<StudyHub />} />
          <Route path="lesson/:lessonId" element={<LessonPage />} />
          <Route path="practice" element={<Practice />} />
          <Route path="mock" element={<MockList />} />
          <Route path="mock/:examId" element={<MockRunner />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="reference" element={<Reference />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
