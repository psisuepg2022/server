interface IPaginationOptions<T = any> {
  size?: unknown;
  page?: unknown;
  filters?: T;
  sortOrder?: "asc" | "desc";
}

export { IPaginationOptions };
