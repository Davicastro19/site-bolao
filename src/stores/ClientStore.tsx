import { action, makeAutoObservable, observable, runInAction } from 'mobx'
import { createContext }  from 'react'
import {  IUser, IUserDetail } from '../interfaces/interfaces';
import { toast } from 'react-toastify'
//import { IMessage, IMessageCreate } from '../components/interfaces/IMessage'
import { setupAPIClient } from '../services/api'
import { iniAllTips, iniAllTipsByIds, iniBaseTipsOne, iniBaseTipsTo, initUser, initUserDetail } from './initState';
import { dateNow, dateTomorrow } from '../utils/date';


class ClientStore {
    loading:boolean = false
    user: IUser = initUser
    userDetail: IUserDetail = initUserDetail
    tomorrowMatchs: any = []
    tipsBaseOne: any = iniBaseTipsOne
    tipsBaseTo: any = iniBaseTipsTo
    link: string = ''
    allTips: any = iniAllTips
    allTipsByIds: any = iniAllTipsByIds
    countBaseTips: number = 0
    countBaseTipsForMatch : number = 1
    useExtra: boolean = false
    spots: any = []
    
    constructor(){
        makeAutoObservable(this, {
            loading: observable,
            user: observable,
            userDetail: observable,
            tomorrowMatchs: observable,
            spots: observable,
            countBaseTipsForMatch: observable,
            link: observable,
            allTips: observable,
            countBaseTips: observable,
            allTipsByIds: observable,
            useExtra: observable,
            setUser: action,
            setUserDetail: action,
            CreateClient:action,
            TomorrowMatchs: action,
            NowMatchs:action,
            BuyTips:action,
            BuySetTips: action,
            setChecked: action,
            setValueHalfScoreTipHalfScore: action,
            setValueHalfScoreTipHalfScoreTeam: action,
            setValuefullScoreTipFullScoreTeam1:action,
            setValuefullScoreTipFullScoreTeam2:action,
            ConfirmWinner:action,
            ConfirmHalfSore:action,
            ConfirmFullScore: action,
            GetTipWinner: action,
            GetTipHalf: action,
            GetTipFull: action,
            ME: action,
            resetStateAllTips: action,
            setCountBaseTipsForMatch: action,
            resetStateAllTipsByIds: action,
            setUseExtra: action,
            setSpos: action
        })
    }    
    
    
    

    CreateClient = async(data: any) => {
        try{
            const apiClient = setupAPIClient();
            const response =  await apiClient.post('/SweepstakesClient/create', data)
             return response.data
        }catch(err){
            return {"status": false, "message": 'Houve um erro desconhecido'}
        }

   }

    NowMatchs = async() => {
        const apiClient = setupAPIClient();
        const response = await apiClient.get(`/SweepstakesMatch/matchByDateNow?dateNow=${dateNow()}`)
        runInAction(()=>{this.tomorrowMatchs = response.data })
       
    }





    ConfirmWinner = async(data: any, id: number) => {
      const newData = {
        tipWinnerOrDraw: data.tipWinnerOrDraw,
        clientId: this.user.id,
        matchId: id,
        useExtra: this.useExtra
      }
      const apiClient = setupAPIClient();
      const response = await apiClient.post('SweepstakesWinner/create',newData)
      toast.success(response.data.message)
    }
    ConfirmHalfSore = async(data: any, id: number) => {
      const newData = {
        tipHalfScore: data.tipHalfScore,
				tipHalfScoreTeam: data.tipHalfScoreTeam,
        clientId: this.user.id,
        matchId: id,
        useExtra: this.useExtra
      }
      const apiClient = setupAPIClient();
      const response = await apiClient.post('SweepstakesHalfScore/create',newData)
      toast.success(response.data.message)
    }
    ConfirmFullScore = async(data: any, id: number) => {
      const newData = {
        tipFullScoreTeam1: data.tipFullScoreTeam1,
			  tipFullScoreTeam2: data.tipFullScoreTeam2,
        clientId: this.user.id,
        matchId: id,
        useExtra: this.useExtra
      }
      const apiClient = setupAPIClient();
      const response = await apiClient.post('SweepstakesFullScore/create',newData)
      toast.success(response.data.message)
    }




    TomorrowMatchs = async() => {
        const apiClient = setupAPIClient();
          const response = await apiClient.get(`/SweepstakesMatch/matchByDateTomorrow?dateNow=${dateNow()}`)
         
          runInAction(()=>{this.tomorrowMatchs = response.data })
          
       
      }
    ME = async() => {
        const apiClient = setupAPIClient();
          const response = await apiClient.get(`/SweepstakesClient/me`)
          const { id, name, access_token, email, zip_code, street, number, cpf, status, isAdmin, baseTips, extraTipsAmount, creationDate, updationDate, state, district, city } = response.data;
          runInAction(()=>{
          this.setUser({ id, name, access_token })
          this.setUserDetail({ email, zip_code, street, number, cpf, status, isAdmin, baseTips,extraTipsAmount, creationDate, updationDate , state, district,city})
             })
          
       
      }
    BuyTips = async(data: any) => {
        const newData = {
        name:this.user.name,
        email:this.userDetail.email,
        cpf:this.userDetail.cpf,
        street:this.userDetail.street,
        number:this.userDetail.number,
        district:this.userDetail.district,
        city:this.userDetail.city,
        state: this.userDetail.state,
        zip_code:this.userDetail.zip_code,
        price: data.price,
        amount: data.amount,
        due_date: `${`${dateNow().split(' ')[1].split('/')[2]}-${dateNow().split(' ')[1].split('/')[1]}-${dateNow().split(' ')[1].split('/')[0]}`}`
      }
        const apiClient = setupAPIClient();
          const response = await apiClient.put(`/SweepstakesExtraTips/saveExtraTips?id=${this.user.id}`,newData)
          runInAction(()=>{
          if (response.data.status) {
              this.tomorrowMatchs = response.data
              toast.success(response.data.message)
              toast.success(response.data.link)
              this.link= response.data.link
          }else{
            toast.warning(response.data.message)
            toast.warning("ID Pagamento: "+response.data.link)
            this.link= response.data.link
          }
        })
    }
    BuySetTips  = async(price:string,  amount:string) => {
        const newData = {
        name:this.user.name,
        email:this.userDetail.email,
        cpf:this.userDetail.cpf,
        street:this.userDetail.street,
        number:this.userDetail.number,
        district: this.userDetail.district,
        city:this.userDetail.city,
        state: this.userDetail.state,
        zip_code:this.userDetail.zip_code,
        price: price,
        amount: amount,
        due_date: `${`${dateTomorrow().split(' ')[1].split('/')[2]}-${dateTomorrow().split(' ')[1].split('/')[1]}-${dateTomorrow().split(' ')[1].split('/')[0]}`}`
      }
        const apiClient = setupAPIClient();
          const response = await apiClient.put(`/SweepstakesClient/updateSetTips?id=${this.user.id}`,newData)
          runInAction(()=>{
          if (response.data.status) {
              this.tomorrowMatchs = response.data
              toast.success(response.data.message)
              toast.success(response.data.link)
              this.link= response.data.link
          }else{
            toast.warning(response.data.message)
            toast.warning("ID Pagamento: "+response.data.link)
            this.link= response.data.link
          }
        })
    }

    GETSPOTS = async() => {
      const apiClient = setupAPIClient()
      const response = await apiClient.get(`SweepstakesRanking/all`)
      //console.log(response.data)
      if (response.data){
        this.setSpos(response.data)

      }else{
        this.setSpos([])
      }
      return  []
    
    }
    setSpos = (value: any) =>{
      this.spots = value
    }
    GetTipWinner = async(match_id:number) => {
      const apiClient = setupAPIClient()
      const response = await apiClient.get(`SweepstakesWinner/getWinnerByIds?userId=${this.user.id}&matchId=${match_id}`)
      //console.log(response.data)
      if (response.data){
        let value = parseInt(this.userDetail.baseTips) - 1
        await this.setCountBaseTips(value)
        let a = this.allTipsByIds
        a.winner.status = true
        a.winner.id = response.data.winner_id
        a.winner.tipWinnerOrDraw = response.data.winner_tipWinnerOrDraw
        a.winner.tipWinnerOrDrawDate = response.data.winner_tipWinnerOrDrawDate
        this.setAllTipsByIds(a)

      }else{
        if (this.countBaseTips === 0){
          let l = this.allTips
          l.winner = {check:false,tipWinnerOrDraw:"0", disable: true},
          this.setAllTips(l)
        }else{
          let l = this.allTips
          l.winner = {check:false,tipWinnerOrDraw:"0", disable: false},
          this.setAllTips(l)
        }
        
      }
      return this.countBaseTips
    
    }
    GetTipHalf = async(match_id:number) => {
      const apiClient = setupAPIClient()
      const response = await apiClient.get(`SweepstakesHalfScore/getHalfScoreByIds?userId=${this.user.id}&matchId=${match_id}`)
      
      if (response.data){
        
        let value = parseInt(this.userDetail.baseTips) - 1
        await this.setCountBaseTips(value)
        let a = this.allTipsByIds
        a.halfScore.status = true
        a.halfScore.id = response.data.halfScore_id
        a.halfScore.tipHalfScoreTeam = response.data.halfScore_tipHalfScoreTeam
        a.halfScore.tipHalfScore = response.data.halfScore_tipHalfScore
        a.halfScore.tipHalfScoreDate = response.data.halfScore_tipHalfScoreDate
        this.setAllTipsByIds(a)
      }else{
        if (this.countBaseTips === 0){
        let s = this.allTips
        s.halfScore = {check:false,tipHalfScoreTeam:"1", tipHalfScore:"1", disable: true} 
        this.setAllTips(s)
      }
        else{
          let s = this.allTips
          s.halfScore = {check:false,tipHalfScoreTeam:"1", tipHalfScore:"1", disable: false} 
          this.setAllTips(s)
        }
      }
      return this.countBaseTips
    }
    GetTipFull = async(match_id:number) => {
      const apiClient = setupAPIClient()
      const response = await apiClient.get(`SweepstakesFullScore/getFullScoreByIds?userId=${this.user.id}&matchId=${match_id}`)
      //console.log('nos',response.data)
      if (response.data){
        let value = parseInt(this.userDetail.baseTips) - 1
        await this.setCountBaseTips(value)
        let a = this.allTipsByIds
        a.fullScore.status = true
        a.fullScore.id = response.data.fullScore_id
        a.fullScore.tipFullScoreTeam1 = response.data.fullScore_tipFullScoreTeam1
        a.fullScore.tipFullScoreTeam2 = response.data.fullScore_tipFullScoreTeam2
        a.fullScore.tipFullScoreDate = response.data.fullScore_tipFullScoreDate
        this.setAllTipsByIds(a)
        
      }else{
        if (this.countBaseTips === 0){
        let s = this.allTips
        s.fullScore = {check:false,tipFullScoreTeam1:"0",tipFullScoreTeam2: "0", disable: true }
        this.setAllTips(s)}
        else{
          let s = this.allTips
        s.fullScore = {check:false,tipFullScoreTeam1:"0",tipFullScoreTeam2: "0", disable: false }
        this.setAllTips(s)
        }
      }
      return this.countBaseTips
    }

    setCountBaseTipsForMatch =(value: number, name: string)=>{
        if(name === 'zerar'){
          this.countBaseTipsForMatch = 0
        }
        if(name === "somar"){
          this.countBaseTipsForMatch = this.countBaseTipsForMatch + value
        }
       
    }
    setAllCheck = () =>{
      if(parseInt(this.userDetail.extraTipsAmount) === 0 && this.countBaseTips === 0){
        if (!this.allTips.winner.check) {
          this.allTips.winner.disable = true
        }
        if (!this.allTips.halfScore.check) {
          this.allTips.halfScore.disable = true
        }
        if (!this.allTips.fullScore.check) {
          this.allTips.fullScore.disable = true
        }
      }else{
        if (this.allTips.winner.disable) {
          this.allTips.winner.disable = false
        }
        if (this.allTips.halfScore.disable) {
          this.allTips.halfScore.disable = false
        }
        if (this.allTips.fullScore.disable) {
          this.allTips.fullScore.disable = false
        }
      }
    }

    setUseExtra = (value: boolean ) => {
      this.useExtra = value
    }
    setLoading = (value: boolean ) => {
        this.loading = value
    }
    setUserDetail = (value: IUserDetail) => {
        this.userDetail = value
    }
    setUser = (value: IUser) => {
        this.user = value
    }
    
    setChecked = (value: boolean, name: string) =>{
      if(value){
        if(this.countBaseTips >0){
          this.allTips[name].check = value
          this.countBaseTips = this.countBaseTips - 1
        }else{
          if(parseInt(this.userDetail.extraTipsAmount) >0){
            this.allTips[name].check = value
            let newValue = parseInt(this.userDetail.extraTipsAmount) - 1
            this.userDetail.extraTipsAmount = newValue.toString()
            //var = base
          }
        }

      }else{
        
          if(this.countBaseTips < parseInt(this.userDetail.baseTips)){
            this.allTips[name].check = value
            this.countBaseTips = this.countBaseTips + 1
          }else{
            this.allTips[name].check = value
              let newValue = parseInt(this.userDetail.extraTipsAmount) + 1
              this.userDetail.extraTipsAmount = newValue.toString()
          }
        
        
        
        

      }

    this.setAllCheck()
      
    }
    setAllTipsByIds = (value: any) =>{
      this.allTipsByIds = value

    }
    setAllTips = (value: any) =>{
      this.allTips = value

    }
    resetStateAllTips =() =>{
      this.allTips = iniAllTips
    }
    resetStateAllTipsByIds =() =>{
      this.allTipsByIds = iniAllTipsByIds
    }
    setValueWinner = (value: string) =>{
        this.allTips.winner.tipWinnerOrDraw = value
        
    }
    setValueHalfScoreTipHalfScoreTeam = (value: string) => {
        this.allTips.halfScore.tipHalfScoreTeam = value
        
    }
    setValueHalfScoreTipHalfScore = (value: string) => {
        this.allTips.halfScore.tipHalfScore = value
    }
    setValuefullScoreTipFullScoreTeam1 = (value: string) => {
        this.allTips.fullScore.tipFullScoreTeam1 = value
    }
    setValuefullScoreTipFullScoreTeam2 = (value: string) => {
        this.allTips.fullScore.tipFullScoreTeam2 = value
        
    }
    setCountBaseTipsPure = (value: number) => {
      this.countBaseTips = value
    }
    setCountBaseTips = async(value: number) => {
      this.setCountBaseTipsPure(value)
      ////console.log(this.countBaseTips,name,'se')
      //////console.log('FDP',parseInt(this.userDetail.baseTips)=== 1 && value >= 1,parseInt(this.userDetail.baseTips), value)
      //this.setCountBaseTipsPure(parseInt(this.userDetail.baseTips))
      //////console.log(parseInt(this.userDetail.baseTips)=== 1 && value >= 1)
      //if(parseInt(this.userDetail.baseTips)=== 1 && value >= 1){
      //  this.countBaseTips = this.countBaseTips- 1
      //}else if(parseInt(this.userDetail.baseTips) === 2 && value >= 2){
      //  this.countBaseTips = this.countBaseTips - 2
      //}else{
      //  this.countBaseTips = parseInt(this.userDetail.baseTips)
      //}
      
      
    }

 
        
            
}

export default createContext(new ClientStore());