interface IPaginationResponse<T = any> {
  items: T[];
  totalItems: number;
}

export { IPaginationResponse };
