import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblemsByTopic } from '../data/problems';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CheckCircle2, Circle } from 'lucide-react';

export default function TopicList() {
  const { topicId } = useParams();
  const problems = getProblemsByTopic(topicId);
  const [solved] = useLocalStorage('solvedQuestions', []);

  if (problems.length === 0) {
    return <div className="p-10 text-center text-slate-400">No problems found for this topic yet.</div>;
  }

  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return 'text-emerald-400 bg-emerald-400/10';
      case 'medium': return 'text-amber-400 bg-amber-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize mb-2">{topicId} Problems</h1>
        <p className="text-slate-400">Master {topicId} concepts by solving these hand-picked questions.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/50">
              <th className="p-4 font-semibold text-slate-300 w-16 text-center">Status</th>
              <th className="p-4 font-semibold text-slate-300">Title</th>
              <th className="p-4 font-semibold text-slate-300 w-32">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((prob) => {
              const isSolved = solved.includes(prob.id);
              return (
                <tr key={prob.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-center">
                    {isSolved ? (
                      <CheckCircle2 className="inline-block text-emerald-500" size={20} />
                    ) : (
                      <Circle className="inline-block text-slate-600" size={20} />
                    )}
                  </td>
                  <td className="p-4">
                    <Link to={`/problem/${prob.id}`} className="font-medium hover:text-emerald-400 transition-colors">
                      {prob.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(prob.difficulty)}`}>
                      {prob.difficulty}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
