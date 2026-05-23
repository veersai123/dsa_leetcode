const fs = require('fs');
let content = fs.readFileSync('src/data/array/Salesforce-oa.json', 'utf8');

const startStr = '"notes": "';
const endStr = '",\n    "complexity"';

const startIndex = content.indexOf(startStr) + startStr.length;
const endIndex = content.indexOf(endStr);

if (startIndex > startStr.length && endIndex > -1) {
  const rawNotes = content.substring(startIndex, endIndex);
  
  // Escape backslashes and double quotes
  const fixedNotes = rawNotes
    .replace(/\\/g, '\\\\') 
    .replace(/"/g, '\\"');

  const fixedContent = content.substring(0, startIndex) + fixedNotes + content.substring(endIndex);
  
  fs.writeFileSync('src/data/array/Salesforce-oa.json', fixedContent);
  console.log("Fixed Salesforce JSON!");
} else {
  console.log("Could not find boundaries.");
}
