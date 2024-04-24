import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
   baseURL: API_BASE,
   timeout: 30000,
   headers: {
      'Content-Type': 'application/json',
   },
});

api.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      // Do something with response error
      // if (error.response.status === 401) {

      // }
      if (error.status !== undefined || error.response.status === 404) {
         return {
            data: null,
            error: error.response.data.error,
         };
      }
      return Promise.reject(error);
      // return error.response;
   }
);

const getErrorText = (error) => error || 'Sayfa Bulunamadı';

export const checkError = (res) => {
   if (res != undefined && (res.status < 200 || res.status >= 300)) {
      return new Error(getErrorText(res.data.message));
   }
};

const exportedApi = {
   api,
};

export default exportedApi;
