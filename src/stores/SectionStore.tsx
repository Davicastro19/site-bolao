
import { action, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react'
import { IMatch, IMatchMap, ISection } from '../interfaces/interfaces';
import { iniBaseTipsOne, iniBaseTipsTo, iniGameSelectedBet } from './initState';
function limpar(x:any) {
    return x.replace(",", "").replace(".", "").replace("R$", "").replace(" ", "");
}

// Recebe um número inteiro (valor em centavos) e devolve uma string com o
// seu valor formatado como se fosse um valor monetário em real.
function formatarMoeda(numero:any) {

    if (isNaN(numero)) return "Valor não preenchido corretamente";

    // Descobre se o valor é negativo e extrai o sinal.
    var negativo = numero < 0;
    numero = Math.abs(numero);

    // Usado para produzir a resposta, caractere por caractere.
    var resposta = "";

    // Converte o número para string.
    var t = numero + "";

    // Itera cada caractere do número, de trás para frente.
    for (var i = t.length - 1; i >= 0; i--) {
        var j = t.length - i;

        // Adiciona o caractere na resposta.
        resposta = t.charAt(i) + resposta;

        // Colocar uma vírgula ou um ponto se for o caso.
        if (j == 2) {
            resposta = "," + resposta;
        } else if (j % 3 == 2 && i != 0) {
            resposta = "." + resposta;
        }
    }

    // Preenche os zeros a esquerda para o caso de o valor ser muito pequeno (menos de um real).
    if (resposta.length < 4) {
        resposta = "0,00".substring(0, 4 - resposta.length) + resposta;
    }
 
    // Coloca o sinal de negativo, se necessário.
    if (negativo) resposta = "-" + resposta;

    // Coloca como prefixo a unidade da moeda.
    return resposta;
}

function somar(a:any,b:any) {
    // Obtém os dois valores digitados.
    var a:any = parseInt(limpar(a), 10);
    var b:any = parseInt(limpar(b), 10);

    // Executa a soma.
    var soma = a + b;

    // Formata o resultado como moeda.
    return formatarMoeda(parseInt(soma))
}

function subtrair(a:any,b:any) {
    // Obtém os dois valores digitados.
    var a:any = parseInt(limpar(a), 10);
    var b:any = parseInt(limpar(b), 10);

    // Executa a soma.
    var subtrair = a - b;

    // Formata o resultado como moeda.
    return formatarMoeda(subtrair)
}
class SectionStore {
    section: ISection = {name:'nothing'}
    typeRaking: string = 'Ranking Geral'
    dayGame: string ='Próximos jogos'
    moreTipsModal: boolean = false
    tipsBaseOne: any = iniBaseTipsOne
    tipsBaseTo: any = iniBaseTipsTo
    loading: boolean = false
    bettingModal: boolean = false
    gameSelectedBet: IMatchMap = iniGameSelectedBet
    
    constructor(){
        makeAutoObservable(this, {
            section: observable,
            dayGame: observable,
            typeRaking:observable,
            moreTipsModal:observable,
            tipsBaseOne: observable,
            tipsBaseTo: observable,
            loading: observable,
            bettingModal: observable,
            gameSelectedBet: observable,
            UpdateSection: action,
            setTypeRaking: action,
            setMoreTipsModal: action,
            setTipsBaseToAmount : action,
            setTipsBaseOneAmount : action,
            setLoading: action,
            

        })
    }
    setDayGame = (name: string) => {
        this.dayGame = name;
    }
    UpdateSection = (name: string) => {
        this.section.name = name;
    }
    setTypeRaking = (value: string) => {
        this.typeRaking = value
    }
    setMoreTipsModal = (value: boolean) => {
        this.moreTipsModal = value
    }
    setLoading = (value: boolean) => {
        this.loading = value
    }
 
    
    setTipsBaseOneAmount = (operador: any) => {
        switch(operador) {
            case '-':
              if(parseInt(this.tipsBaseOne.amount) > 1){    
                const newValue = parseInt(this.tipsBaseOne.amount)-1
                this.tipsBaseOne.amount = newValue.toString()
                this.tipsBaseOne.price = subtrair(this.tipsBaseOne.price,'5,00')

              }
              break;
            case '+':
                if(parseInt(this.tipsBaseOne.amount) < 199){
                const newValue = parseInt(this.tipsBaseOne.amount)+1
                this.tipsBaseOne.amount = newValue.toString()
                this.tipsBaseOne.price = somar(this.tipsBaseOne.price,'5,00')
                }
              break;
            default:
                break;
          }
        //this.tipsBaseOne.amount = '2'
        }
  
    setTipsBaseToAmount = (operador: any) => {
        switch(operador) {
            case '-':
              if(parseInt(this.tipsBaseTo.amount) > 10){    
                const newValue = parseInt(this.tipsBaseTo.amount)-10
                this.tipsBaseTo.amount = newValue.toString()
                this.tipsBaseTo.price = subtrair(this.tipsBaseTo.price,'40,00')

              }
              break;
            case '+':
                if(parseInt(this.tipsBaseTo.amount) < 950){    
                const newValue = parseInt(this.tipsBaseTo.amount)+10
                this.tipsBaseTo.amount = newValue.toString()
                this.tipsBaseTo.price = somar(this.tipsBaseTo.price,'40,00')
                }
              break;
            default:
                break;
          }
        //this.tipsBaseOne.amount = '2'
        }
    setBettingModal = (value: boolean) => {
        this.bettingModal = value
    }
    setGameSelectedBet = (value: IMatchMap) => {
        this.gameSelectedBet = value
    }
   


}
export default createContext(new SectionStore());