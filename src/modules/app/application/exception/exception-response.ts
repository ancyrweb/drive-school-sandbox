export type ExceptionResponse<T = any> = {
  statusCode: number;
  clientCode: string;
  message: string;
  payload: T;
};
