import React from 'react';
import { getTopics, allProblems } from '../data/problems';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CheckCircle, Clock, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [solved] = useLocalStorage('solvedQuestions', []);
  const [bookmarked] = useLocalStorage('bookmarkedQuestions', []);
  const [revise] = useLocalStorage('reviseLaterQuestions', []);

  const totalQuestions = allProblems.length;
  const solvedCount = solved.length;
  const progressPercentage = totalQuestions === 0 ? 0 : Math.round((solvedCount / totalQuestions) * 100);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome Back! 🚀</h1>
      <p className="text-slate-400 mb-10">Track your DSA progress and master new concepts.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Solved</p>
            <p className="text-2xl font-bold">{solvedCount} <span className="text-sm text-slate-500 font-normal">/ {totalQuestions}</span></p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Progress</p>
            <p className="text-2xl font-bold">{progressPercentage}%</p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-xl">
            <Star size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Bookmarks</p>
            <p className="text-2xl font-bold">{bookmarked.length}</p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">To Revise</p>
            <p className="text-2xl font-bold">{revise.length}</p>
          </div>
        </div>
      </div>

      {/* Topics Overview */}
      <h2 className="text-xl font-bold mb-6">Explore Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getTopics().map(topic => {
          const topicProblems = allProblems.filter(p => p.topic === topic);
          const solvedInTopic = topicProblems.filter(p => solved.includes(p.id)).length;
          const percentage = Math.round((solvedInTopic / topicProblems.length) * 100) || 0;

          return (
            <Link to={`/topic/${topic.toLowerCase()}`} key={topic} className="glass p-6 rounded-2xl hover:border-slate-600 transition-colors block cursor-pointer group">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition-colors">{topic}</h3>
                <span className="text-sm text-slate-400">{topicProblems.length} items</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 text-right">{percentage}% completed</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
