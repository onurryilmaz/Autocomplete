import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

const useCustomDispatch = () => {
   const dispatch = useDispatch();

   const fetchData = useCallback(
      async (axiosMethod: any, url: string, reduxAction: any) => {
         try {
            const response = await axiosMethod(url);
            const newResponse = {
               data: { ...response.data },
               status: response.status,
               error: response.error,
            };
            await dispatch(reduxAction(newResponse));
         } catch (error) {
            throw error;
         }
      },
      [dispatch]
   );

   return fetchData;
};

export default useCustomDispatch;
