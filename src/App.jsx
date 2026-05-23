import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import TopicList from './pages/TopicList';
import QuestionWorkspace from './pages/QuestionWorkspace';
import QuestionBuilder from './pages/QuestionBuilder';
import QuoteTicker from './components/QuoteTicker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="topic/:topicId" element={<TopicList />} />
          <Route path="builder" element={<QuestionBuilder />} />
        </Route>
        {/* Workspace is outside of AppLayout so it can take full screen */}
        <Route path="/problem/:questionId" element={<QuestionWorkspace />} />
      </Routes>
      <QuoteTicker />
    </BrowserRouter>
  );
}

export default App;
