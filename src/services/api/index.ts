import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const ApiErrorResource = (error: AxiosError) => {
  const errorData = error?.response?.data as Record<string, string | object>;

  if (error?.response?.status === 401) {
    //
  }

  return Promise.reject({
    data: errorData,
    status: error?.response?.status,
  });
};

export const apiResource = () => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_GIFT_UP_API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  /**
   * Response interceptor
   */
  client.interceptors.response.use((response: AxiosResponse) => {
    if (![200, 201].includes(response?.status)) {
      Promise.reject(response?.data?.message ?? "");
    }
    return Promise.resolve(response?.data);
  }, ApiErrorResource);

  return client;
};
