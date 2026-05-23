import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Folder, List, LayoutTemplate } from 'lucide-react';
import { getTopics } from '../data/problems';

export default function Sidebar() {
  const topics = getTopics();

  return (
    <aside className="w-64 h-screen border-r border-[var(--color-border-color)] bg-[var(--color-bg-sidebar)] flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-[var(--color-border-color)]">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-white hover:text-emerald-400 transition-colors">
          <LayoutTemplate className="text-emerald-500" />
          DSA Master
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
          <NavLink 
            to="/" 
            className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            end
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/builder" 
            className={({isActive}) => `flex items-center gap-3 px-3 py-2 mt-1 rounded-lg transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="bg-emerald-500/20 text-emerald-500 p-1 rounded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <span className="font-medium text-emerald-400">Add Question</span>
          </NavLink>
        </div>

        <div className="px-4 mt-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Topics</p>
          <div className="space-y-1">
            {topics.map(topic => (
              <NavLink 
                key={topic}
                to={`/topic/${topic.toLowerCase()}`} 
                className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Folder size={18} className="text-slate-400" />
                <span>{topic}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
