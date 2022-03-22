export function GenerateId() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9)
};

export const CamelCaseToDashed = (myStr) => {
  return !myStr ? null : myStr.replace(/([A-Z])/g, function (g) { return '-' + g[0].toLowerCase() })
}

export function GenerateName(string) {
  const stringArray = string.split('');
  const firstLetter = stringArray[0].toUpperCase();
  const restOfString = stringArray.slice(1).join('');
  return firstLetter + restOfString;
}

export function IncreaseNameNumber(string) {
  const stringArray = string.split(' ');
  const lastLetter = stringArray[stringArray.length - 1];
  const number = parseInt(lastLetter);

  const newNumber = isNaN(number) ? 1 : number + 1;

  const restOfString = stringArray.length > 1 ? stringArray.slice(0, stringArray.length - 1).join(' ') : stringArray.join(' ');

  return restOfString + ' ' + newNumber;
}

export function FixDuplicateName(name, names) {
  let i = 1;
  while (names.includes(name)) {
    name = IncreaseNameNumber(name);
    i++;
  }
  return name;
}