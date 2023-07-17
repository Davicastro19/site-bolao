// eslint-disable-next-line
export interface IUser{
    id: string,
    name: string, 
    access_token: string, 
    }

export interface HomeProps {
        matchNow: IMatch[]
        }

export interface IUserDetail{
    email: string;
    zip_code: string;
    street: string;
    number: string;
    cpf: string;
    status: boolean;
    state: string;
    city: string
    district: string;
    isAdmin: boolean;
    baseTips: string;
    extraTipsAmount:string;
    creationDate: string;
    updationDate: string;
}
export interface IItem{
        amount: number, 
        observation: string,
        productId: string,
        ordersId: string
        }

export interface ISection{
    name: string;
}
export interface IUpdateCompany{
    name: string,
    email: string, 
    pix: string, 
    password: string,
    image: any,
    addressOne: string
    phone: string
    monthlyDay: string
    type: string
    }

export interface IMatch{
    id: number;
    team1: string;
    finalTeam1Score: string;
    team2: string;
    finalTeam2Score: string;
    matchDate: string;
    updationDate: string;
    status: string;
}

export interface IMatchMap{
    match_id: number;
    match_team1: string;
    match_finalTeam1Score: string;
    match_team2: string;
    match_finalTeam2Score: string;
    match_matchDate: string;
    match_updationDate: string;
    match_status: string;
}
/* eslint-disable prettier/prettier */
export interface IExtraTips{
    id: string ;
    buyId: string;
    buyValue: string;
    extraTipsAmount: string;
    paymantDate: string;
    updationDate: string;
}

export interface IAllTips {
    count:number,
    winner:{check:boolean,tipWinnerOrDraw:string, disable: boolean},
    halfScore:{check:boolean,tipHalfScoreTeam:string, tipHalfScore:string, disable: false}, 
    fullScore:{check:boolean,tipFullScoreTeam1:string,tipFullScoreTeam2: string, disable: false }
}