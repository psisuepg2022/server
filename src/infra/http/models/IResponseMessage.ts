interface IResponseMessage<T = any> {
  content?: T;
  success: boolean;
  message: string;
}

export { IResponseMessage };
