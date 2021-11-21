const weightedPick = <T extends unknown>(array: T[], weight: number[]) => {
  const weightSum = weight.reduce((prev, weight) => {
    return [...prev, weight + (prev[prev.length - 1] || 0)];
  }, [] as number[]);

  const random = Math.random() * weightSum[weightSum.length - 1];

  for (let i = 0; i < weightSum.length; i++) {
    if (random <= weightSum[i]) return array[i];
  }
}

export default weightedPick;