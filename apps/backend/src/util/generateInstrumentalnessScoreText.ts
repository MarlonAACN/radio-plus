function generateInstrumentalnessScoreText(value: number): string {
  if (value === 0) {
    return 'completely vocal';
  }

  if (value < 0.2) {
    return 'predominantly vocal';
  }

  if (value < 0.4) {
    return 'some vocals';
  }

  if (value < 0.6) {
    return 'balanced';
  }

  if (value < 0.8) {
    return 'mostly instrumental';
  }

  if (value < 1) {
    return 'predominantly instrumental';
  }

  if (value === 1) {
    return 'purely instrumental';
  }

  return '--';
}

export { generateInstrumentalnessScoreText };
