const arrayContainsArray = <T>(
  toCompare: Array<T>,
  contains: Array<T>
): boolean => contains.every((item) => toCompare.includes(item));

export { arrayContainsArray };
