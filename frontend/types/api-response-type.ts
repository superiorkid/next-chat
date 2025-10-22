export type TApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};
