function isWhitespaceString(string: string): boolean {
  return !string.replace(/\s/g, '').length;
}

export { isWhitespaceString };
