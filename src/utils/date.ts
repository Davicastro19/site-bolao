export const dateNow = () =>{
    const currentDate = new Date();
    const data =  currentDate.toLocaleDateString('pt-Br', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'})
    return data
  }
  export const dateTomorrow = () =>{
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const data =  currentDate.toLocaleDateString('pt-Br', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'})
    return data
  }
  export const dateHourNow = () =>{
    const currentDate = new Date();
    const data =  currentDate.toLocaleDateString('pt-Br', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    return data
  }
  export const dateHourTomorrow = () =>{
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const data =  currentDate.toLocaleDateString('pt-Br', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'})
    return data
  }