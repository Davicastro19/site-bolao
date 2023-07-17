import { Box,  Text, Stack } from '@chakra-ui/react'
import { Button } from "@chakra-ui/button"

import styles from './styles.module.scss'
import { IoMdLogOut, IoMdCart } from 'react-icons/io'
import { FaUserAlt, FaRegListAlt } from 'react-icons/fa'
import Image from 'next/image'
import SectionStore from '../../../stores/SectionStore';
import { useContext, useEffect } from 'react';
import { AuthContext, signOut } from '../../../contexts/AuthContext';
import ClientStore from '../../../stores/ClientStore'
import Router from "next/router";
import { toast } from 'react-toastify'
import ComponentStore from '../../../stores/ComponentStore'
import { initUser, initUserDetail } from '../../../stores/initState'

export default function Header() {
    //const companyStore = useContext(CompanyStore);
    //const { AllCategories, getProductByCategory, IniAllCategories, getCompany, allCategories, 
    //    allproducts, company} = companyStore
    
    const { signOut } = useContext(AuthContext)
    const clientStore = useContext(ClientStore);
    const { user, userDetail,setUser,setUserDetail } = clientStore
    const sectionStore = useContext(SectionStore);
    const { UpdateSection } = sectionStore
    //
    //const componentStore = useContext(ComponentStore);
    //const { categorySelected, setCategorySelected } = componentStore
    //

    //
    //
    function SignOutHandle() {
        signOut()
        setUser(initUser)
        setUserDetail(initUserDetail)
    }
    
    //async function setModalRequestsHandle() {
    //    await getOrders({"id":user?.id,"status": 1000, "draft": false  })
    //    
    //  }
    //async function setModalCartHandle(){
    //    getDetailUser()
    //    const responss = await getOrder()
    //    if (responss) {
    //      setOreders(responss)
    //    }
    //    const response = await OrderDetail()
    //    if (response.data){
    //        setModalCart(true)
    //        toast.success("Ai esta seu carrinho")
    //        const responses = await OrderDetail()
    //        setCountItens(responses.count)
    //        setValue(responses.total)
    //        
    //    }else{
    //        toast.warning("Você não tem nada no carrinho")
    //    }
    //    
    //    
    //}
    //function setModalUserHenadle(){
    //    getDetailUser()
    //    setModalUser(true)
    //}
    //async function getCountItens() {
    //    getCompany()
    //    getDetailUser()
    //    const responss = await getOrder()
    //    if (responss) {
    //      setOreders(responss)
    //      toast.success('Você tem uma ordem aberta')
    //      const responses = await OrderDetail()
    //      setCountItens(responses.count)
    //      setValue(responses.total)
    //    }
    //    return          
    //    
    //    
    //
    //  }
    // 
    //  useEffect(() => {
    //    if (section.name != 'signUpCompany' && section.name != 'signUpClient' && section.name != 'nothings') {
    //    if (user?.id != ''){
    //     getCountItens()}
    //    }
    //    //AllCategories()
    //  },[])
    //useEffect(() => {
    //
    //    if (section.name != 'signUpCompany' && section.name != 'signUpClient' && section.name != 'nothings') {
    //      getCompany()
    //      getCountItens()
    //      IniAllCategories(allCategories)
    //      getProductByCategory(allCategories[0].category_id)
    //      setCategorySelected(allCategories[0].category_name)
    //      UpdateSection('nothings')
    //    }
    //  }, [])
    //
    //




    return (
        <>

            <header className={styles.headerContainer} >

                <Box boxShadow='dark-lg' borderBottomRadius={'20px'} bg={'#292929'} width={'100%'}  padding={'0% 10% 1% 10%'} margin={'0 auto'} display={'flex'} justifyContent={'space-between'} >
                    <Box maxWidth={'1120px'} >
                        {userDetail.email != '' &&
                            <Button backgroundColor={'transparent'}  colorScheme={'whiteAlpha'} marginTop={'20px '} >
                                <FaUserAlt color="#FFF" size={30} />
                            </Button>
                        }
                    </Box>

                    <Button height={'70px'} className={styles.image} onClick={() => UpdateSection('nothing')} colorScheme={'transparent'} backgroundColor={'transparent'}>
                        <Image  width={80} height={200} src={"/cut.svg"} alt=''  />

                    </Button>
                    <Box maxWidth={'1120px'}  >
                        {userDetail.email != '' &&
                            <Button backgroundColor={'transparent'}  colorScheme={'whiteAlpha'} marginTop={'20px '} onClick={SignOutHandle}>
                                <IoMdLogOut color="#FFF" size={30} />
                            </Button>
                        }
                    </Box>
                </Box>

            </header>
        </>

    )
}

