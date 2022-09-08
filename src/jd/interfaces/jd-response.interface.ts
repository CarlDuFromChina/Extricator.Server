export interface JdResponse<T> {
  code: string,
  data: T,
  errorMessage?: string
}
