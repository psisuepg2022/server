interface IPaginationResponse<T = any> {
  itens: T[];
  totalItens: number;
}

export { IPaginationResponse };
