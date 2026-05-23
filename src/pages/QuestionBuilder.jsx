import React, { useState } from 'react';
import { Download, Copy, Code } from 'lucide-react';

export default function QuestionBuilder() {
  const [formData, setFormData] = useState({
    title: '',
    topic: 'Graph',
    difficulty: 'Medium',
    problem: '',
    approach: '',
    bruteforce: '',
    optimized1: '',
    optimized2: '',
    notes: '',
    complexity: '',
    referenceLinks: ''
  });

  const generateId = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getJSONString = () => {
    const id = generateId(formData.title) || 'new-problem';
    const jsonObj = {
      id,
      ...formData
    };
    return JSON.stringify(jsonObj, null, 2);
  };

  const handleSaveFile = async () => {
    const id = generateId(formData.title) || 'new-problem';
    const jsonStr = getJSONString();
    
    try {
      if (window.showSaveFilePicker) {
        // Use native Windows Save dialog
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `${id}.json`,
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(jsonStr);
        await writable.close();
      } else {
        throw new Error('Save API not supported');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback if browser blocks it
        navigator.clipboard.writeText(jsonStr);
        alert('Browser blocked the download. JSON has been COPIED to your clipboard! Just create a new file in VS Code and paste it.');
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getJSONString());
    alert('JSON Copied to Clipboard!');
  };

  return (
    <div className="p-10 max-w-5xl mx-auto h-screen overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Code className="text-emerald-500" />
          Question Builder
        </h1>
        <p className="text-slate-400">Generate local JSON files for new questions instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="glass p-6 rounded-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Number of Islands" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Topic Folder</label>
              <input type="text" name="topic" value={formData.topic} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Problem Statement (Markdown)</label>
            <textarea name="problem" value={formData.problem} onChange={handleChange} rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Approach (Markdown)</label>
            <textarea name="approach" value={formData.approach} onChange={handleChange} rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Optimized Code (Markdown/Code block)</label>
            <textarea name="optimized1" value={formData.optimized1} onChange={handleChange} rows="5" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Complexity (Markdown)</label>
            <textarea name="complexity" value={formData.complexity} onChange={handleChange} rows="2" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Reference Links (Comma separated URLs)</label>
            <input type="text" name="referenceLinks" value={formData.referenceLinks} onChange={handleChange} placeholder="https://youtube.com/..., https://article.com/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Export JSON</h2>
            <p className="text-sm text-slate-400 mb-4">
              1. Click Save File to open the folder picker and save the file directly. <br/>
              2. Or click Copy to manually paste it in a new file in VS Code.
            </p>
            <div className="flex gap-4 mb-4">
              <button 
                onClick={handleSaveFile}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={20} />
                Save File Directly
              </button>
              <button 
                onClick={handleCopy}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-600"
              >
                <Copy size={20} />
                Copy JSON
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl flex-1 overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold mb-4">JSON Preview</h2>
            <pre className="bg-slate-900 p-4 rounded-xl text-emerald-400 text-xs overflow-auto flex-1 border border-slate-700">
              {getJSONString()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
