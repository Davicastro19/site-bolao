import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { useContext } from 'react';
import ClientStore from '../stores/ClientStore';
import { signOut } from '../contexts/AuthContext'
import { AuthTokenError } from './errors/AuthTokenErros'

export function setupAPIClient(context: any = undefined) {
    
    let cookies = parseCookies(context)
    const api = axios.create({
        
        //baseURL: 'http://192.168.1.7:5000/',
         baseURL: 'https:///',
        headers: {
            Authorization: `Bearer ${cookies['@sweepstakeba233763defb059d333f4dd35152da1183ed90ccb8bdb342f0c94cb64ee7fc91d17125d4765d90395249697e6d8498515274d630805c1fbb822c2bbd.token']}`
        }
    })
    api.interceptors.response.use(response => { return response; }, (error: AxiosError) => {

        if (error.response?.status === 401) {
            if (typeof window !== undefined) {
                signOut();
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }
        return Promise.reject(error);
    })
    return api
}
