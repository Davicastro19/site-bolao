import { action, makeAutoObservable, observable, runInAction } from 'mobx'
import { createContext } from 'react'
import { toast } from 'react-toastify'
//import { IMessage, IMessageCreate } from '../components/interfaces/IMessage'
import { setupAPIClient } from '../services/api'


class ComponentStore {
    categorySelected: string = ''
    constructor(){
        makeAutoObservable(this, {
            categorySelected: observable,
           
            setCategorySelected: action,
        })
    }

    setCategorySelected = (value: string) => {
        this.categorySelected = value
    }

  
}

export default createContext(new ComponentStore());