const csv = require('csv-parser')
const fs = require('fs')
const stringify = require("json-stringify-pretty-compact");
const year = '2021'
let results = [];

function formatDataBlock(results) {
  let res = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i+1] && parseInt(results[i][1]) + 1 == parseInt(results[i+1][1])) {
      res.push({
        start: `${results[i][0]}-${results[i][1]}-${year}`,
        end: `${results[i+1][0]}-${results[i+1][1]}-${year}`
      });
      i = i+1;
    } else {
      res.push(`${results[i][0]}-${results[i][1]}-${year}`);
    }
  }
  console.log(res);
  return res;
}

function formatData(data) {
  let result = {};
  // format remote days:
  result.remoteDates = formatDataBlock(results.filter( r => r[2] === 'D' ));
  // format free days (avoids weekends):
  result.freeDates = formatDataBlock(results.filter( r => {
    let date = new Date(`${r[0]}-${r[1]}-${year}`);
    if (r[2] == 'F' && date.getDay() != 6 && date.getDay() != 0) return true;
  } ));
  // returns populated object:
  return result;
}

fs.createReadStream('file.csv')
  .pipe(csv())
  .on('data', (data) => {
    // groups data in array of arrays:
    for (key in data) {
      if (!results[key]) results[key] = [];
      if (data[key].indexOf('-') != -1) data[key] = data[key].split('-')[0];
      results[key].push(data[key])
    }
  })
  .on('end', () => {
    console.log(stringify(formatData(results), 1, 2));
  });
