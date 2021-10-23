export interface IErrorResponse {
  code: number;
  success: boolean;
  detail: string | null;
  message: string;
  error: string;
  timeStamp: string;
}

export interface ISuccessResponse {
  code: number;
  success: boolean;
  timeStamp: string;
  data: any
}
