import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenErros";

//funcao para paaginas que so users logados podem acessar
export function canSSRAuth<P extends { [key: string]: any; }>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P> | any> => {
        const cookies = parseCookies(ctx);

        const token = cookies['@sweepstakeba233763defb059d333f4dd35152da1183ed90ccb8bdb342f0c94cb64ee7fc91d17125d4765d90395249697e6d8498515274d630805c1fbb822c2bbd.token'];
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: true,
                }
            }
        }
        try {
            return await fn(ctx);
        } catch (err) {
            if (err instanceof AuthTokenError) {
                destroyCookie(ctx, '@sweepstakeba233763defb059d333f4dd35152da1183ed90ccb8bdb342f0c94cb64ee7fc91d17125d4765d90395249697e6d8498515274d630805c1fbb822c2bbd.token');
                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}