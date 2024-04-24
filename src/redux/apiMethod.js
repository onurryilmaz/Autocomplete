import APIBASE, { checkError } from './api';
// import APISERVER, { checkErrorServer } from './apiServer';
export const getMethod = async (url) => {
   const res = await APIBASE.api.get(`${url}`);
   checkError(res);
   return res;
};
export const postMethod = async (url, data) => {
   const res = await APIBASE.api.post(`${url}`, data);
   checkError(res);
   return res.data;
};
export const putMethod = async (url, data) => {
   const res = await APIBASE.api.put(`${url}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
   });
   checkError(res);
   return res;
};
//SERVER APİ
export const postMethodServer = async (url, data) => {
   const res = await APIBASE.api.post(`${url}`, data);
   checkError(res);
   return res.data;
};
