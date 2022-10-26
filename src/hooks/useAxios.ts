import axios, { ResponseType } from "axios";
import { useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { RootState } from '../store/store';

type RequestConfig = {
    url: string;
    method?: string;
    headers?: {[key: string]: string};
    authRequired?: boolean;
    responseType?: ResponseType;
    body?: {[key:string]: string | null} | FormData;
    abortController?: AbortController;
}

type ResponseError = {
    code: number;
    message: string
}
type SendRequestFunction<T> = (config: RequestConfig, applyData?: (data: T) => void) => Promise<boolean>;

type AxiosHookResult<T> = {
    error: ResponseError | null;
    isLoading: boolean;
    sendRequest: SendRequestFunction<T>;
}

const defaultHeaders = {'X-API-KEY': process.env.REACT_APP_API_KEY as string};
const baseURL = 'https://fullstack.exercise.applifting.cz';

const useAxios = <T>(): AxiosHookResult<T> => {
    const history = useHistory();
    const accesToken = useSelector((state: RootState) => state.auth.access_token);
    const [error, setError] = useState<ResponseError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const sendRequest = useCallback<SendRequestFunction<T>>(async (config, applyData?) => {
        const {url, method = 'GET', headers, authRequired, responseType = 'json', body, abortController} = config;
        const finalURL = `${baseURL}/${url}`;
        let finalHeaders: {[key: string]: string} = {
            ...defaultHeaders,
        };
        if (authRequired) {
            finalHeaders = {...finalHeaders, Authorization: accesToken as string}
        }

        setIsLoading(true);

        try {
            const response = await axios (finalURL, {
                method,
                headers: headers ? {...headers, ...finalHeaders} : finalHeaders,
                data: body ? body : {},
                responseType,
                signal: abortController?.signal
            })
            applyData?.(response.data);
            setIsLoading(false);
            setError(null);
            return true;

        } catch (error: any) {
            let code = 0;
            let message = 'Unknown error';

            if (error?.name !== 'CanceledError') {
                setIsLoading(false);
            }

            if (error.response) {
                code = error.response.status;
                message = error.response.data.message;
            }
            setError({
                code, 
                message
            });
            
            return false;
        }
    }, []);

    if (error?.code === 403) {
        history.replace('/login');
    }
    return {error, isLoading, sendRequest};
}

export default useAxios;