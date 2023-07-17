import type { NextPage } from 'next'
import {  Box, SimpleGrid, Divider, Stack, Input, Center, Text, Button } from '@chakra-ui/react'
import styles from '../../../../styles/Home.module.scss'
import Image from 'next/image'
import { colorApp } from '../../../../styles/style'
import { FormEvent, useContext, useState } from 'react'
import ClientStore from '../../../stores/ClientStore'
import { toast } from 'react-toastify'
import  Router, { useRouter }  from 'next/router'
import SectionStore from '../../../stores/SectionStore'


const SignUp: NextPage = () => {
  const router = useRouter()
  
  const clientStore = useContext(ClientStore);
  const { CreateClient, loading,setLoading  } = clientStore
  const sectionStore = useContext(SectionStore);
  const { UpdateSection } = sectionStore

    
  const [name,setName] = useState<string>('')
  const [email,setEmail] = useState<string>('')
  const [cpf,setCpf] = useState<string>('')
  const [password,setPassword] = useState<string>('')
  const [street,setStreet] = useState<string>('')
  const [number,setNumber] = useState<string>('')
  const [zipCode,setZipCode] = useState<string>('')
  const [states, setStates] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [district, setDistrict] = useState<string>('')

  async function CreateHandler() {
    
    if (states !== '' && district !== "" && email !== '' && name !== '' && password.length > 5 && cpf.length > 9 && street !== '' &&  zipCode.length > 7  && number !== ''){
   
      const data = {
        "name":name,
        "email":email,
        "cpf":cpf,
        "password":password,
        "street":street,
        "number":number,
        "zip_code":zipCode,
        "state": states,
        "district": district,
        "city":city,
        "isAdmin":false,
        "idPaymentTips":'',
        "pricePaymentTips":'',
        "baseTips":'0',
        'children': router.asPath.split('?')[1]?router.asPath.split('?')[1]:''
      }
      const response = await CreateClient(data)
      if (response.status){
        UpdateSection('nothing')
        toast.success(response.message)
      }else{
        toast.warning(response.message)

      }
      
    }else{
     toast.warning('Todos os campos são obrigatórios')
    }
    setLoading(false)
    
  }

 
  return (
    <Center flexDirection={'column'}   height={'600px'} >
              <Box >
            <Box    bg={'#292929'} className={styles.formsall} >
           
            <Box margin={'15px 0px 10px'} >
              <Image  width={200} height={200} src={"/cut.svg"} alt='Damov' />
                </Box>
                <Text fontWeight='bold' fontStyle={'italic'} fontFamily='revert'  >CADASTRE-SE</Text>
              <form  className={styles.signup}  >
           

              <Box alignItems={'center'}  marginBottom={'10px'} display={'flex'} flexDirection={'column'} >
                   
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setName(e.target.value)} placeholder='Nome'   value={name}   name='name'   focusBorderColor={'white'} />
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setCpf(e.target.value)} placeholder='CPF'   value={cpf}   name='CPF'  type={'number'}  css focusBorderColor={'white'} />
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setEmail(e.target.value)} placeholder='Email'  value={email} name='email' type={'email'}  focusBorderColor={'white'} />
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setPassword(e.target.value)} placeholder='Senha'  value={password}   name='password' type={'password'}   focusBorderColor={'white'} />
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setStreet(e.target.value)} value={street} placeholder='Logradouro(Rua/Avenida)'  name='logs'   focusBorderColor={'white'} />
                <Box    justifyContent='space-between' display={'flex'} >
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setNumber(e.target.value)} value={number} placeholder='Numero(Casa/Ap)'   name='number' marginRight={'10px'}  type={'number'} focusBorderColor={'white'} />
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setZipCode(e.target.value)} value={zipCode} placeholder='CEP(sem traço)'  name='cep' marginLeft={'10px'} focusBorderColor={'white'} />
                </Box>
                <Box    justifyContent='space-between' display={'flex'} >
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setStates(e.target.value)} value={states} placeholder='Estado(EX:SP)'   name='state' marginRight={'10px'}  focusBorderColor={'white'} />
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setDistrict(e.target.value)} value={district} placeholder='Bairro'  name='street' marginLeft={'10px'} focusBorderColor={'white'} />
                </Box>
                <Input marginTop={'10px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} onChange={(e) => setCity(e.target.value)} value={city} placeholder='Cidade(Ex: São Paulo)'  name='city'   focusBorderColor={'white'} />
                
                {!loading && 
                <Button 
                isLoading={loading}
              loadingText='Loading' marginTop={'20px'} onClick={CreateHandler}
                  width={'120px'} borderRadius={'60px'} backgroundColor={'white'} 
                    colorScheme={'white'}  fontWeight='bold' fontStyle={'italic'} 
                    fontFamily='revert' 
                     color={'black'}>
                  Cadastrar
                </Button>}
              </Box>
              </form>

</Box>
</Box>
              </Center>
  )
}

export default SignUp
