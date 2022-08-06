interface IPaginationOptions<T = any> {
  size?: unknown;
  page?: unknown;
  filters: T | null;
  sortOrder?: "asc" | "desc";
}

export { IPaginationOptions };
