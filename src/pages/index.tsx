import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from './components/Header'
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import SectionStore from '../stores/SectionStore'
import { observer } from 'mobx-react'
import SignUpClient from './client/signUp'
import { Box, Text, Stack, Heading, Center, Badge, Flex, Avatar, Divider, InputGroup, InputLeftElement, Input, Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, FormControl, FormLabel, ModalFooter, SimpleGrid } from '@chakra-ui/react'
import { Button, IconButton } from "@chakra-ui/button"
import { SearchIcon, AddIcon } from '@chakra-ui/icons'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";
import styles from './styles.module.scss'
import { canSSRGuest } from '../utils/canSSRGuest'
import ComponentStore from '../stores/ComponentStore'
import { toast } from 'react-toastify'
import { AuthContext } from '../contexts/AuthContext'
import ClientStore from '../stores/ClientStore'
import { useRouter } from 'next/router'

const Home: any = () => {

  const sectionStore = useContext(SectionStore);
  const componentStore = useContext(ComponentStore);
  const [modal, setModal] = useState(false)
  const { section, UpdateSection } = sectionStore
  const { signIn } = useContext(AuthContext)
  const clientStore = useContext(ClientStore);

  const [email,setEmail] = useState<string>('')
  const [password,setPassword] = useState<string>('')
  
  async function LoginHandle() {
      if (email !== ''  && password !== ''){
         
          const detail = {
            email:email,
            password:password
        }
        UpdateSection('nothing')
        await signIn(detail)
        
      }else{
        toast.warning('Todos os campos são obrigatórios')
      }
    }
  return (
    <>
      <Head>
        <title>Bem-Vindo</title>
      </Head>
      <Box backgroundColor='#1A202C' >

        {section.name === 'signUpClient' &&
          <SignUpClient></SignUpClient>
        }


        {(section.name === 'nothing' || section.name === 'nothings') &&
          <>
            <Center flexDirection={'column'}   height={'600px'} >
              <Box >
              <Box bg={'#292929'} className={styles.formsall}   >
                <Box margin={'10px 0px 40px'} className={styles.nav}>
                  <Image  width={200} height={200} src={"/cut.svg"} alt='Damov' />
                </Box>
                  <Text marginBottom={'20px'} fontWeight='bold' fontStyle={'italic'} fontFamily='revert'  >ENTRE NA SUA CONTA</Text>
                <form className={styles.login}  >


                  <Box alignItems={'center'} display={'flex'} flexDirection={'column'} >
                    <Input borderRadius={'8px'}  bg={'#1F1F1F'} onChange={(e) => setEmail(e.target.value)} placeholder='Email' value={email} name='email' type={'email'} borderColor={'#1F1F1F'}  focusBorderColor={'white'}  />
                    <Input borderRadius={'8px'}  bg={'#1F1F1F'} onChange={(e) => setPassword(e.target.value)} placeholder='Senha' value={password} name='password' type={'password'} borderColor={'#1F1F1F'} color={'white'} focusBorderColor={'white'} marginTop={'15px'} />
                    <Box marginTop={'20px'}>
                    <Button  width={'120px'}  onClick={LoginHandle} borderRadius={'60px'} backgroundColor={'white'} 
                    colorScheme={'white'}  fontWeight='bold' fontStyle={'italic'} fontFamily='revert'  color={'black'}>
                      Entrar
                    </Button>
                    </Box>
                    <Button  fontSize={'13px'} marginTop={'15px'} color='white' backgroundColor={'transparent'} onClick={() => UpdateSection('signUpClient')} colorScheme={'#4141'}>
                    Clique aqui parar criar a sua conta.
              </Button>
                  </Box>
                </form>

              </Box>
              </Box>
              </Center>

          </>
        }
      </Box>
    </>
  )
}

export default observer(Home)


export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})