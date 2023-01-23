export function convertCsvToJson(csvFile: string) {
  const array = csvFile.split('\n');

  const csvToJsonResult = [];

  const headers = array[0].split(';');

  for (let i = 1; i < array.length - 1; i++) {
    /* Empty object to store result in key value pair */
    const jsonObject = {};
    /* Store the current array element */
    const currentArrayString = array[i];
    let string = '';

    let quoteFlag = 0;
    for (const character of currentArrayString) {
      if (character === '"' && quoteFlag === 0) {
        quoteFlag = 1;
      } else if (character === '"' && quoteFlag == 1) quoteFlag = 0;
      //if (character === ',' && quoteFlag === 0) character = '|';
      if (character !== '"') string += character;
    }

    const jsonProperties = string.split(';');

    for (const j in headers) {
      if (jsonProperties[j].includes(';')) {
        jsonObject[headers[j]] = jsonProperties[j]
          .split(';')
          .map((item) => item.trim());
      } else jsonObject[headers[j]] = jsonProperties[j];
    }

    /* Push the genearted JSON object to resultant array */
    csvToJsonResult.push(jsonObject);
  }
  /* Convert the final array to JSON */
  return JSON.stringify(csvToJsonResult);
}
