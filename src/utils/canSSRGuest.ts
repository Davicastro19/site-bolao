import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

//função para pagina q so podem ser acessadas por vistantes
export function canSSRGuest<P extends { [key: string]: any; }>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> =>{
        const cookies = parseCookies(ctx);
        // Seo cara ja tentar acessar a pagina porem ja tendo um login salvo redirecionamos
        if(cookies['@sweepstakeba233763defb059d333f4dd35152da1183ed90ccb8bdb342f0c94cb64ee7fc91d17125d4765d90395249697e6d8498515274d630805c1fbb822c2bbd.token']){
            return{
                redirect:{
                    destination: '/client/dashboard',
                    permanent: false,
                }
            }
        }
        return await fn(ctx);
    }
}