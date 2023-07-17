import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
//import { type } from "os";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from '../services/apiClient';
import ClientStore from "../stores/ClientStore";
import { AuthProviderProps, SignInProps, UserDetailProps, UserProps } from "../types/type";

type AuthContextData = {
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    //signUp: (credentials: SignUpProps) => Promise<void>;
}


export const AuthContext = createContext({} as AuthContextData)
//

export function signOut() {
    try {

        destroyCookie(undefined, '@sweepstakeba233763defb059d333f4dd35152da1183ed90ccb8bdb342f0c94cb64ee7fc91d17125d4765d90395249697e6d8498515274d630805c1fbb822c2bbd.token', {
            path: '/', 
          })
        Router.push('/')
        

    } catch {
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const clientStore = useContext(ClientStore);
    const { setUser,setUserDetail } = clientStore
    useEffect(() => {
        const { '@sweepstakeba233763defb059d333f4dd35152da1183ed90ccb8bdb342f0c94cb64ee7fc91d17125d4765d90395249697e6d8498515274d630805c1fbb822c2bbd.token': token } = parseCookies()
        if (token) {
            api.get('/SweepstakesClient/me')
                .then(response => {
                    const { id, name, access_token, email, zip_code, street, number, cpf, status, isAdmin, baseTips, extraTipsAmount, creationDate, updationDate, state, district, city } = response.data;
                    setUser({ id, name, access_token })
                    setUserDetail({ email, zip_code, street, number, cpf, status, isAdmin, baseTips,extraTipsAmount, creationDate, updationDate , state, district,city})
            

                })
                .catch(() => {

                    signOut()
                })
        }
    }, [setUser,setUserDetail])
    async function signIn(data: SignInProps) {
        try {
            const response = await api.post('/SweepstakesClient/auth', data)
            if (response.data.status) {
                const { id, name, access_token } = response.data
                setCookie(undefined, '@sweepstakeba233763defb059d333f4dd35152da1183ed90ccb8bdb342f0c94cb64ee7fc91d17125d4765d90395249697e6d8498515274d630805c1fbb822c2bbd.token', access_token, {
                    maxAge: 60 * 60 * 24 * 30,//1 mes
                    path: "/"
                })
                api.defaults.headers['Authorization'] = `Bearer ${access_token}`
                setUser({ id, name, access_token })
                api.get('/SweepstakesClient/me')
                    .then(response => {
                        const { id, name, access_token, email, zip_code, street, number, cpf, status, isAdmin, baseTips, extraTipsAmount, creationDate, updationDate,state, district,city } = response.data;
                        setUser({ id, name, access_token })
                        setUserDetail({ email, zip_code, street, number, cpf, status, isAdmin, baseTips,extraTipsAmount, creationDate, updationDate,state, district,city  })
                    })
                    .catch(() => {

                        signOut()
                    })
                toast.success("Logado com sucesso!")
                Router.push('/client/dashboard')
            } else {
                toast.warning("Dados Invalidos")
            }
        } catch(e:any){
            toast.error(e.toString())
        }
    }
    //    
    //
    //    async function signUp({name, email, password}){
    //        try{
    //            const response = await api.post('/users/create', {name,email,password})
    //            toast.success("Conta criada com sucesso!")
    //            Router.push('/')
    //        }catch{
    //            toast.error("Erro ao criar acesso!")
    //        }
    //    }
    //
    return (
        <AuthContext.Provider value={{ signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}