const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'src', 'data', 'array', 'Salesforce-oa.json');
const mdPath = path.join(__dirname, 'temp-approach.md');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const newApproach = fs.readFileSync(mdPath, 'utf8');

data.approach = newApproach;

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4));
console.log('Successfully updated approach!');
