import { ReactNode } from "react";

export type UserProps = {
    id: string;
    name: string;
    access_token: string;
}

export type UserDetailProps = {
    email: string;
    zip_code: string;
    street: string;
    number: string;
    cpf: string;
    status: boolean;
    isAdmin:boolean;
    creationDate: string;
    updationDate: string;
}


export type SignInProps={
    email: string;
    password: string;
}
export type SignUpProps={
    name: string;
    password: string;
}

export type AuthProviderProps = {
    children: ReactNode
}