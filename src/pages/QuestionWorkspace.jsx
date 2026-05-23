import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProblemById } from '../data/problems';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ChevronLeft, CheckCircle2, Circle, Bookmark, Clock, LayoutTemplate } from 'lucide-react';
import AiMentor from '../components/AiMentor';

export default function QuestionWorkspace() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const problem = getProblemById(questionId);

  const [activeTab, setActiveTab] = useState('approach');
  
  const [solved, setSolved] = useLocalStorage('solvedQuestions', []);
  const [bookmarked, setBookmarked] = useLocalStorage('bookmarkedQuestions', []);
  const [revise, setRevise] = useLocalStorage('reviseLaterQuestions', []);

  // Store user-edited code temporarily. Resets on refresh/change question
  const [userCodes, setUserCodes] = useState({});
  React.useEffect(() => {
    setUserCodes({});
  }, [questionId]);

  if (!problem) return <div className="p-10 text-slate-400">Problem not found.</div>;

  const isSolved = solved.includes(problem.id);
  const isBookmarked = bookmarked.includes(problem.id);
  const isRevise = revise.includes(problem.id);

  const toggleArray = (arr, setArr, item) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const tabs = [
    { id: 'approach', label: 'Approach' },
    { id: 'bruteforce', label: 'Brute Force' },
    { id: 'optimized1', label: 'Optimized 1' },
    { id: 'optimized2', label: 'Optimized 2' },
    { id: 'notes', label: 'Notes' },
    { id: 'complexity', label: 'Complexity' },
    { id: 'referenceLinks', label: 'Links' },
  ];

  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'hard': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getCodeContent = (tabId, markdownStr) => {
    // If user edited it, return the edited version
    if (userCodes[tabId] !== undefined) return { code: userCodes[tabId], language: 'java' };
    if (!markdownStr) return { code: '', language: 'java' };
    
    // Extract code block if it exists
    const match = markdownStr.match(/^```(\w+)?\n([\s\S]*?)\n```$/);
    if (match) {
      return { language: match[1] || 'java', code: match[2] };
    }
    return { language: 'java', code: markdownStr };
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-main)]">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-[var(--color-bg-sidebar)] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          
          <Link to="/" className="font-bold flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors border-r border-slate-700 pr-4 mr-2">
            <LayoutTemplate size={18} />
            <span className="hidden sm:inline">DSA Master</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">{problem.title}</h1>
            <span className={`text-xs font-medium px-2 py-0.5 rounded bg-slate-800 \${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => toggleArray(solved, setSolved, problem.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors \${isSolved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            {isSolved ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            {isSolved ? 'Solved' : 'Mark Solved'}
          </button>
          
          <button 
            onClick={() => toggleArray(bookmarked, setBookmarked, problem.id)}
            className={`p-1.5 rounded-md transition-colors \${isBookmarked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            title="Bookmark"
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button 
            onClick={() => toggleArray(revise, setRevise, problem.id)}
            className={`p-1.5 rounded-md transition-colors \${isRevise ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            title="Revise Later"
          >
            <Clock size={18} />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          
          {/* Left Panel: Problem Statement */}
          <Panel defaultSize={50} minSize={30} className="bg-[var(--color-bg-main)] overflow-y-auto">
            <div className="p-6 prose prose-invert max-w-none">
              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{problem.problem}</Markdown>
            </div>
          </Panel>

          {/* Resizer Divider */}
          <PanelResizeHandle className="w-2 bg-slate-900 flex flex-col justify-center items-center cursor-col-resize hover:bg-emerald-500/50 transition-colors group">
            <div className="h-8 w-0.5 bg-slate-600 rounded-full group-hover:bg-white transition-colors"></div>
          </PanelResizeHandle>

          {/* Right Panel: Solution / Notes Tabs */}
          <Panel defaultSize={50} minSize={30} className="bg-[var(--color-bg-panel)] flex flex-col">
            
            {/* Tabs Header */}
            <div className="flex overflow-x-auto border-b border-slate-800 bg-[var(--color-bg-sidebar)]">
              {tabs.map(tab => {
                if (!problem[tab.id] && tab.id !== 'notes' && tab.id !== 'approach') return null; // Hide empty tabs
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors \${activeTab === tab.id ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className={`flex-1 overflow-y-auto ${['bruteforce', 'optimized1', 'optimized2'].includes(activeTab) ? 'p-0 h-full' : 'p-6 prose prose-invert max-w-none'}`}>
              {activeTab === 'referenceLinks' ? (
                <div className="flex flex-col gap-3">
                  {problem.referenceLinks ? problem.referenceLinks.split(',').map((link, i) => (
                    <a key={i} href={link.trim()} target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 transition-colors flex items-center gap-3 no-underline text-emerald-400 font-medium">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      {link.trim()}
                    </a>
                  )) : <p className="text-slate-500 italic p-6">No links available.</p>}
                </div>
              ) : ['bruteforce', 'optimized1', 'optimized2'].includes(activeTab) && problem[activeTab] ? (() => {
                const { code, language } = getCodeContent(activeTab, problem[activeTab]);
                return (
                  <Editor
                    height="100%"
                    defaultLanguage={language}
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setUserCodes(prev => ({...prev, [activeTab]: val}))}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 15,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: 'on'
                    }}
                  />
                );
              })() : problem[activeTab] ? (
                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{problem[activeTab]}</Markdown>
              ) : (
                <p className="text-slate-500 italic p-6">No content available for {activeTab}.</p>
              )}
            </div>

          </Panel>
        </PanelGroup>
      </div>
      
      {/* AI Mentor Chatbot */}
      <AiMentor problem={problem} userCodes={userCodes} />
    </div>
  );
}
