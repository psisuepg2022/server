const stringIsNullOrEmpty = (value: string | null): boolean =>
  !value || value.length === 0;

export { stringIsNullOrEmpty };
