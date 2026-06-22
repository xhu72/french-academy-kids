// Fisher-Yates shuffle — returns a new array, doesn't mutate the original
export function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result
}