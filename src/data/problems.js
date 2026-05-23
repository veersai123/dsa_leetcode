import twoSum from './array/two-sum.json';
import longestSubstring from './string/longest-substring.json';
import stringParitySum from './greedy/string-parity-sum.json';
import SalesforceOa from './array/Salesforce-oa.json';

export const allProblems = [
  twoSum,
  longestSubstring,
  stringParitySum,
  SalesforceOa,
  // Add more imported JSONs here
];

export const getProblemById = (id) => {
  return allProblems.find((p) => p.id === id);
};

export const getProblemsByTopic = (topic) => {
  return allProblems.filter((p) => p.topic.toLowerCase() === topic.toLowerCase());
};

export const getTopics = () => {
  const topics = new Set(allProblems.map((p) => p.topic));
  return Array.from(topics);
};
