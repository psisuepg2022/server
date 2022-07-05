const arraysAreEqual = <T>(a: Array<T>, b: Array<T>): boolean =>
  a.length === b.length && a.every((item) => b.includes(item));

export { arraysAreEqual };
