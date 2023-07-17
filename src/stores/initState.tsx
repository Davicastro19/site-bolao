export const initUser = {
    id: "",
    name: "", 
    access_token: "", 
    }

export const initUserDetail = {
        email: "",
        zip_code: "",
        street: "",
        number: "",
        cpf: "",
        isAdmin: false,
        status: false,
        state: "",
        city: "",
        district:"",
        baseTips: "",
        extraTipsAmount:"",
        creationDate: "",
        updationDate: "",
 }

export const iniGameSelectedBet = {
    match_id: 0,
    match_team1:"",
    match_finalTeam1Score: "",
    match_team2:"",
    match_finalTeam2Score: "",
    match_matchDate: "",
    match_updationDate: "",
    match_status: "0"
}

 export const iniBaseTipsOne = {
    "price": "5,00",
    "amount": "1"
}

export const iniBaseTipsTo = {
    "price": "40,00",
    "amount": "10"
}

export const iniAllTips = {count:0,
    winner:{check:false,tipWinnerOrDraw:"0", disable: false},
    halfScore:{check:false,tipHalfScoreTeam:"1", tipHalfScore:"3", disable: false}, 
    fullScore:{check:false,tipFullScoreTeam1:"0",tipFullScoreTeam2: "0", disable: false }}


export const iniAllTipsByIds = {
    winner:{
        status:false,
        id: "",
        tipWinnerOrDraw: "",
        tipWinnerOrDrawDate: ""
    },
    halfScore:{
        status:false,
        id: "",
        tipHalfScoreTeam: "",
        tipHalfScore: "",
        tipHalfScoreDate: ""
    }, 
    fullScore:{status:false,tipFullScoreTeam1:"",tipFullScoreTeam2: "",tipFullScoreDate:""}}