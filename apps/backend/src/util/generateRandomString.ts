/**
 * Returns a random string, consisting of numbers and strings.
 * @param length {number} The length of the generated string.
 * @returns {string} The random string.
 */
function generateRandomString(length: number): string {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export { generateRandomString };
