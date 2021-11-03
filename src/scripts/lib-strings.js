export function GenerateId () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9)
};

export const CamelCaseToDashed = (myStr) => {
  return !myStr ? null : myStr.replace(/([A-Z])/g, function (g) { return '-' + g[0].toLowerCase() })
}