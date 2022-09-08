export interface JuejinResponse<T> {
  err_no: number;
  err_msg: string;
  data: T;
}
