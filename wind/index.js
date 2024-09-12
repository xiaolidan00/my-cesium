const data = require('./wind-100.json');
console.log(data.length);
const fs = require('fs');
fs.writeFile('./wind-10.json', JSON.stringify(data.slice(0, 10)), () => {
  console.log('ok');
});
