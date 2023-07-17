import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../components/Header'
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import SectionStore from '../../../stores/SectionStore'
import { observer } from 'mobx-react'
import { Box, Text, Stack, Heading, Center, Badge, Flex, Avatar, Divider, InputGroup, InputLeftElement, Input, Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, FormControl, FormLabel, ModalFooter, NumberInput, NumberInputStepper, NumberIncrementStepper, NumberInputField, NumberDecrementStepper, Textarea, Radio, RadioGroup, OrderedList, useClipboard, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, SimpleGrid, Checkbox } from '@chakra-ui/react'
import { Button, IconButton } from "@chakra-ui/button"
import { MinusIcon, AddIcon } from '@chakra-ui/icons'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";
import styles from './styles.module.scss'
import { HomeProps, IMatch, IMatchMap } from '../../../interfaces/interfaces'
import { ftruncateSync } from 'fs'
import { canSSRAuth } from '../../../utils/canSSRAuth'
import ComponentStore from '../../../stores/ComponentStore'
import ClientStore from '../../../stores/ClientStore'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { IoIosInformation } from 'react-icons/io'
import { statusName, statusColor, colorApp } from '../../../../styles/style'
import { AuthContext, signOut } from '../../../contexts/AuthContext'
import { dateHourNow, dateHourTomorrow, dateNow, dateTomorrow } from '../../../utils/date'
import { toCompare } from '../../../utils/globalFunction'
import { setupAPIClient } from '../../../services/api'

const Dashboard: React.FC = ({ matchNow }: HomeProps | any) => {
  const [matchSelectView, setMatchSelectView] = useState(matchNow)
  const [stadomarzok, setStadomarzok] = useState(false)
  const clientStore = useContext(ClientStore);
  const [modalOption, setModalOption] = useState(false)
  const [tipoOption, setTipoOption] = useState('')
  const { user, userDetail, TomorrowMatchs, tomorrowMatchs, NowMatchs, BuyTips, link, BuySetTips,
    allTips, setValueWinner, setValueHalfScoreTipHalfScoreTeam, setValueHalfScoreTipHalfScore,
    setValuefullScoreTipFullScoreTeam2, setValuefullScoreTipFullScoreTeam1, setChecked
    , ConfirmWinner, ConfirmHalfSore, ConfirmFullScore, countBaseTips, setCountBaseTips,
    GetTipWinner, GetTipHalf, GetTipFull, allTipsByIds, ME, setCountBaseTipsForMatch, countBaseTipsForMatch,
    resetStateAllTips, resetStateAllTipsByIds, setUseExtra,GETSPOTS ,spots} = clientStore

  const sectionStore = useContext(SectionStore);
  const { setTypeRaking, typeRaking, dayGame, setDayGame, moreTipsModal, setMoreTipsModal, tipsBaseOne,
    tipsBaseTo, setTipsBaseOneAmount, setTipsBaseToAmount, loading, setLoading, bettingModal, setBettingModal,
    setGameSelectedBet, gameSelectedBet } = sectionStore

  async function ConfimTipsHandle(id: number) {
    setLoading(true)
    if (allTips.winner.check) {
      await ConfirmWinner(allTips.winner, id)
    }
    if (allTips.halfScore.check) {
      await ConfirmHalfSore(allTips.halfScore, id)
    }
    if (allTips.fullScore.check) {
      await ConfirmFullScore(allTips.fullScore, id)
    }
    setModalOption(false)
    setBettingModal(false)
    setUseExtra(false)
    ME()
    setLoading(false)
  }
  function FinishBetting() {
    resetStateAllTips()
    resetStateAllTipsByIds()
    setBettingModal(false)
    setModalOption(false)
    ME()
  }

  function BettingOption(name: string) {
    let options = 0
    if (name === 'Vencedor da partida') {
      allTips.winner.check = true
    }
    if (allTipsByIds.winner.status) {
      options += 1
    }
    if (name === 'Placar de um time') {
      allTips.halfScore.check = true
    }
    if (allTipsByIds.halfScore.status) {
      options += 1
    }
    if (name === 'Placar da partida') {
      allTips.fullScore.check = true
    }
    if (allTipsByIds.fullScore.status) {
      options += 1
    }
    if (options >= parseInt(userDetail.baseTips)) {
      toast.info("Você usou todos seus palpites! Vamos acessar o extra.")
    } else {
      setModalOption(true)
      setTipoOption(name)
      return
    }
    if (parseInt(userDetail.extraTipsAmount) > 0) {
      setModalOption(true)
      setTipoOption(name)
      setUseExtra(true)
    } else {
      toast.info("Você não tem palpites extras! Compre agora e palpite já!")
    }
  }
  async function BuySetTipsHandle(price: string, amount: string) {
    setLoading(true)
    await BuySetTips(price, amount)
    setLoading(false)

  }
  async function BuyTipsHandle(price: string, amount: string) {
    setLoading(true)
    const data = { price: price, amount: amount }
    await BuyTips(data)
    setLoading(false)
  }

  async function setDayGameNow(value: string) {
    setDayGame(value)
    await NowMatchs()
    setMatchSelectView(tomorrowMatchs)


  }

  async function setDayGameNext(value: string) {
    setDayGame(value)
    await TomorrowMatchs()
    setMatchSelectView(tomorrowMatchs)

  }


  async function MotalTipsHandler(item: IMatchMap) {
    setCountBaseTips(parseInt(userDetail.baseTips))
    setGameSelectedBet(item)
    ////setCountBaseTipsForMatch(0,'zerar')
    ////setCountBaseTips()
    await setLoading(true)
    await GetTipWinner(item.match_id)
    await GetTipHalf(item.match_id)
    await GetTipFull(item.match_id)
    setBettingModal(true)

    //if (allTipsByIds.winner.status) {
    //  await setCountBaseTipsForMatch(1,'somar')
    //  await setCountBaseTips(countBaseTipsForMatch,'102')
    //}
    //if (allTipsByIds.halfScore.status) {
    //  setCountBaseTipsForMatch(countBaseTipsForMatch + 1,'sla')
    //  setCountBaseTips(countBaseTipsForMatch,'ss')
    //}
    //if (allTipsByIds.fullScore.status) {
    //  setCountBaseTipsForMatch(countBaseTipsForMatch + 1,'sal')
    //  setCountBaseTips(countBaseTipsForMatch,'1')
    //}
    //
    //
    //// if(countBaseTips === 0 && countBaseTipsForMatch ){
    //setBettingModal(true)
    ////}
    setLoading(false)
  }
  useEffect(() => {
    const fetchData = async () => {
      
      await GETSPOTS()
      
    }
    
      fetchData()
    
    if (tomorrowMatchs.length > 0) {
      
      setMatchSelectView(tomorrowMatchs)
    } else {
      setMatchSelectView(matchNow)
    }
  }, [tomorrowMatchs, setMatchSelectView, TomorrowMatchs, NowMatchs, matchNow, matchSelectView])

  return (
    <>
      <Head>
        <title>Bem-Vindo</title>
      </Head>
      <Box >
        <Header></Header>
      </Box>

      <Modal
        isOpen={bettingModal}
        onClose={FinishBetting}
      >
        <ModalOverlay />
        <ModalContent boxShadow='lg' bg={'#292929'} borderRadius={'25px'} >
          <Center flexDirection={'column'} display={'flex'}>
            <Text fontSize='sm' color={'gray'} fontWeight={'550'} marginTop={'20px'}>{gameSelectedBet.match_matchDate.split(' ')[2]}</Text>
          </Center>
          <ModalCloseButton color={'white'} />
          <ModalBody borderRadius={'20px'} bg={'#292929'} pb={6} flexDirection={'column'} alignItems='center' justifyContent='space-between' display={'flex'}>
            <Stack direction='row' spacing={4}>
              <Center flexDirection={'column'} display={'flex'}>

                <Center flexDirection={'row'} display={'flex'}>
                  <Center  >
                    <Center margin={'10px'} width={'165px'} >
                      <Text fontSize='2xl' fontWeight={'550'} >{gameSelectedBet.match_team1}</Text>
                    </Center>

                    <Box margin={'2px'}   >
                      <Text fontSize='2xl' fontWeight={'550'}>x</Text>
                    </Box>

                    <Center margin={'10px'} width={'165px'}  >
                      <Text fontSize='2xl' fontWeight={'550'}>{gameSelectedBet.match_team2}</Text>
                    </Center>
                  </Center>
                </Center>
                <Text fontSize='sm' marginBottom={'10px'} color={'#00FF00'} fontWeight={'450'} fontFamily={'roboto'} fontStyle={'italic'} marginTop={'2px'}>
                  Você tem {userDetail.baseTips} palpites por jogo - {userDetail.extraTipsAmount} extra</Text>


                <Center marginTop={'15px'} width={'440px'} bg={'transparent'} borderColor={'gray'}
                  borderRadius={'4px'} borderBottomWidth={'1px'} borderTopWidth={'1px'} flexDirection={'column'}>

                  <Button marginBottom={'10px'} marginTop={'15px'}
                    height={'30px'}
                    //isLoading={toCompare(item)}
                    onClick={() => BettingOption('Vencedor da partida')}
                    borderRadius={'60px'}
                    disabled={allTipsByIds.winner.status}
                    backgroundColor={'#00FF00'}
                    colorScheme={'#00FF00'}
                    fontWeight='bold'
                    width={'80%'}
                    fontStyle={'italic'}
                    fontFamily={'roboto'}
                    color={'black'}>
                    {allTipsByIds.winner.status ? `Palpite feito as ${allTipsByIds.winner.tipWinnerOrDrawDate.split(' ')[1]} ${allTipsByIds.winner.tipWinnerOrDrawDate.split(' ')[2]}` : 'Palpitar no Vencedor da partida'}
                  </Button>
                  {allTipsByIds.winner.status &&
                    <Box><RadioGroup height={'50px'} marginTop={'5px'} marginBottom={'5px'} marginRight={'20px'} value={allTipsByIds.winner.tipWinnerOrDraw}>
                      <Stack direction='row'>
                        <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='1'>{gameSelectedBet.match_team1}</Radio>
                        <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='2'>{gameSelectedBet.match_team2}</Radio>
                        <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='0'>Empate</Radio>
                      </Stack>
                    </RadioGroup></Box>}
                </Center>
                <Center marginTop={'15px'} width={'440px'} bg={'transparent'} borderColor={'gray'}
                  borderRadius={'4px'} borderBottomWidth={'1px'} borderTopWidth={'1px'} flexDirection={'column'}>

                  <Button marginBottom={'10px'} marginTop={'15px'}
                    height={'30px'}
                    //isLoading={toCompare(item)}
                    onClick={() => BettingOption('Placar de um time')}
                    borderRadius={'60px'}
                    width={'80%'}
                    backgroundColor={'#00FF00'}
                    colorScheme={'#00FF00'}
                    disabled={allTipsByIds.halfScore.status}
                    fontWeight='bold'
                    fontStyle={'italic'}
                    fontFamily={'roboto'}
                    color={'black'}>
                    {allTipsByIds.halfScore.status ? `Palpite feito as ${allTipsByIds.halfScore.tipHalfScoreDate.split(' ')[1]} ${allTipsByIds.halfScore.tipHalfScoreDate.split(' ')[2]}` : 'Palpitar no Placar de um time'}


                  </Button>
                  {allTipsByIds.halfScore.status &&
                    <Box><Center marginBottom={'10px'} marginTop={'5px'}>
                      <RadioGroup marginBottom={'10px'} marginRight={'15px'} onChange={(value) => setValueHalfScoreTipHalfScoreTeam(value)} value={allTipsByIds.halfScore.tipHalfScoreTeam}>
                        <Stack direction='row'>
                          <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='1'>{gameSelectedBet.match_team1}</Radio>
                          <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='2'>{gameSelectedBet.match_team2}</Radio>
                        </Stack>
                      </RadioGroup>
                      <Box marginBottom={'10px'} width={'40px'} height={'30px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'}     >

                        <Text marginTop={'3px'} marginLeft={'15px'} >{allTipsByIds.halfScore.tipHalfScore}</Text>

                      </Box>
                    </Center></Box>}

                </Center>
                <Center marginTop={'15px'} width={'440px'} bg={'transparent'} borderColor={'gray'}
                  borderRadius={'4px'} borderBottomWidth={'1px'} borderTopWidth={'1px'} flexDirection={'column'}>

                  <Button marginBottom={'10px'} marginTop={'15px'}
                    height={'30px'}
                    //isLoading={toCompare(item)}
                    onClick={() => BettingOption('Placar da partida')}
                    borderRadius={'60px'}
                    width={'80%'}
                    backgroundColor={'#00FF00'}
                    colorScheme={'#00FF00'}
                    fontWeight='bold'
                    disabled={allTipsByIds.fullScore.status}
                    fontStyle={'italic'}
                    fontFamily={'roboto'}
                    color={'black'}>
                    {allTipsByIds.fullScore.status ? `Palpite feito as ${allTipsByIds.fullScore.tipFullScoreDate.split(' ')[1]} ${allTipsByIds.fullScore.tipFullScoreDate.split(' ')[2]}` : 'Palpitar no Placar da partida'}


                  </Button>
                  {allTipsByIds.fullScore.status &&
                    <Box flexDirection={'row'} display={'flex'}>
                      <Text fontSize='18px' marginRight={'10px'} >{gameSelectedBet.match_team1}</Text>

                      <Box marginBottom={'10px'} marginRight={'20px'} width={'40px'} height={'30px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'}     >

                        <Text marginTop={'3px'} marginLeft={'15px'}  >{allTipsByIds.fullScore.tipFullScoreTeam1}</Text>

                      </Box>
                      <Text fontSize='18px' marginRight={'10px'} >{gameSelectedBet.match_team2}</Text>

                      <Box marginBottom={'10px'} width={'40px'} height={'30px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'}     >

                        <Text marginTop={'3px'} marginLeft={'15px'} >{allTipsByIds.fullScore.tipFullScoreTeam2}</Text>

                      </Box></Box>}

                </Center>
              </Center>
            </Stack>

          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={moreTipsModal}
        onClose={() => setMoreTipsModal(false)}
      >
        <ModalOverlay />
        <ModalContent boxShadow='lg' bg={'#292929'} borderRadius={'25px'} >
          <ModalHeader borderRadius={'20px'} bg={'#292929'} color={'white'}></ModalHeader>
          <ModalCloseButton color={'white'} />
          <ModalBody borderRadius={'20px'} bg={'#292929'} pb={6} flexDirection={'column'} alignItems='center' justifyContent='space-between' display={'flex'}>
            <Center>
              <Heading overflow={'hidden'} width={'217px'} marginTop={'15px'} as='h3' fontSize={'25px'} fontFamily={'roboto'} fontStyle={'italic'}>PALPITES EXTRAS</Heading>
            </Center>

            <Center>
              <Box margin={'0px 20px 0px 0px'} width={'180px'} alignItems={'center'} display={'flex'} flexDirection={'column'} >

                <Box margin={'20px'} boxShadow='xs' borderRadius={'15px'} width={'170px'} bg={'#191919'} alignItems={'center'} display={'flex'} flexDirection={'column'} >
                  <Text marginTop={'20px'} fontWeight={'450'} >Palpites individuais</Text>
                  <Center  >
                    <Center >
                      <IconButton onClick={() => setTipsBaseOneAmount('-')} colorScheme='white' aria-label='white' variant='outline' borderRadius={'60px'} size={'sm'} fontSize={'12px'} icon={<MinusIcon />} />
                    </Center>

                    <Box   >
                      <Heading overflow={'hidden'} margin={'15px 15px 15px 15px'} as='h3' fontSize={'50px'} fontFamily={'roboto'} fontWeight={'500'} color={'#00FF00'}>{tipsBaseOne.amount}</Heading>
                    </Box>

                    <Center  >
                      <IconButton onClick={() => setTipsBaseOneAmount('+')} colorScheme='white' aria-label='white' variant='outline' borderRadius={'60px'} size={'sm'} fontSize={'12px'} icon={<AddIcon />} />

                    </Center>
                  </Center>

                  <Text fontWeight={'550'} marginBottom={'20px'} color={'#00FF00'}>R$ {tipsBaseOne.price}</Text>

                </Box>
                <Button onClick={() => BuyTipsHandle(tipsBaseOne.price, tipsBaseOne.amount)} marginTop={'10px'} width={'120px'} borderRadius={'60px'} backgroundColor={'white'} colorScheme={'white'} fontWeight='bold' fontStyle={'italic'} fontFamily='revert' color={'black'}> Comprar </Button>
              </Box>
              <Box margin={'0px 0px 0px 20px'} width={'180px'} alignItems={'center'} display={'flex'} flexDirection={'column'} >

                <Box margin={'20px'} boxShadow='xs' borderRadius={'15px'} width={'170px'} bg={'#191919'} alignItems={'center'} display={'flex'} flexDirection={'column'} >
                  <Text marginTop={'20px'} fontWeight={'450'} >Pacotes de palpites</Text>
                  <Center  >
                    <Center >
                      <IconButton onClick={() => setTipsBaseToAmount('-')} colorScheme='white' aria-label='white' variant='outline' borderRadius={'60px'} size={'sm'} fontSize={'12px'} icon={<MinusIcon />} />
                    </Center>

                    <Box   >
                      <Heading overflow={'hidden'} margin={'15px 15px 15px 15px'} as='h3' fontSize={'50px'} fontFamily={'roboto'} fontWeight={'500'} color={'#00FF00'}>{tipsBaseTo.amount}</Heading>
                    </Box>

                    <Center  >
                      <IconButton onClick={() => setTipsBaseToAmount('+')} colorScheme='white' aria-label='white' variant='outline' borderRadius={'60px'} size={'sm'} fontSize={'12px'} icon={<AddIcon />} />

                    </Center>
                  </Center>
                  <Text fontWeight={'550'} marginBottom={'20px'} color={'#00FF00'}>R$ {tipsBaseTo.price}</Text>

                </Box>
                <Button onClick={() => BuyTipsHandle(tipsBaseTo.price, tipsBaseTo.amount)} loadingText='Loading' marginTop={'10px'} width={'120px'} borderRadius={'60px'} backgroundColor={'white'} colorScheme={'white'} fontWeight='bold' fontStyle={'italic'} fontFamily='revert' color={'black'}> Comprar </Button>
              </Box>

            </Center>
            {link.indexOf("https") != -1 &&
              <Center width={'50%'} bg={'#00FF00'} marginTop={'20px'} borderRadius={'20px'} >
                <Box color='black'>
                  <Link color='teal.500' href={link}>
                    Clique aqui para pagar
                  </Link>
                </Box>
              </Center>
            }
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={!userDetail.status}
        onClose={() => function () { }}
      >
        <ModalOverlay />
        <ModalContent height={'0px'} boxShadow='lg' bg={'transparent'} borderRadius={'25px'} >
          <ModalHeader height={'0px'} borderRadius={'20px'} bg={'transparent'} color={'transparent'}>Realise ativação da sua conta</ModalHeader>

          <ModalBody borderRadius={'20px'} bg={'#292929'} pb={6} flexDirection={'column'} alignItems='center' justifyContent='space-between' display={'flex'}>
            <Center>
              <Heading overflow={'hidden'} width={'105px'} marginTop={'15px'} as='h3' fontSize={'25px'} fontFamily={'roboto'} fontStyle={'italic'}>SET TIPS</Heading>
            </Center>

            <Center>
              <Box margin={'0px 20px 0px 0px'} width={'180px'} alignItems={'center'} display={'flex'} flexDirection={'column'} >

                <Box margin={'20px'} boxShadow='xs' borderRadius={'15px'} width={'170px'} bg={'#191919'} alignItems={'center'} display={'flex'} flexDirection={'column'} >
                  <Text marginTop={'20px'} fontWeight={'450'} >Palpites por jogo</Text>

                  <Heading overflow={'hidden'} margin={'15px 15px 15px 15px'} as='h3' fontSize={'50px'} fontFamily={'roboto'} fontWeight={'500'} color={'#00FF00'}>1</Heading>

                  <Text fontWeight={'550'} marginBottom={'20px'} color={'#00FF00'}>R$ 50,00</Text>

                </Box>
                <Button
                  onClick={() => BuySetTipsHandle('50,00', '1')}
                  loadingText='Loading'
                  marginTop={'10px'}
                  width={'120px'} borderRadius={'60px'} backgroundColor={'white'}
                  colorScheme={'white'} fontWeight='bold' fontStyle={'italic'}
                  fontFamily='revert'
                  color={'black'}>
                  Inscrever-se
                </Button>
              </Box>
              <Box margin={'0px 0px 0px 20px'} width={'180px'} alignItems={'center'} display={'flex'} flexDirection={'column'} >

                <Box margin={'20px'} boxShadow='xs' borderRadius={'15px'} width={'170px'} bg={'#191919'} alignItems={'center'} display={'flex'} flexDirection={'column'} >
                  <Text marginTop={'20px'} fontWeight={'450'} >Palpites por jogo</Text>

                  <Heading overflow={'hidden'} margin={'15px 15px 15px 15px'} as='h3' fontSize={'50px'} fontFamily={'roboto'} fontWeight={'500'} color={'#00FF00'}>2</Heading>

                  <Text fontWeight={'550'} marginBottom={'20px'} color={'#00FF00'}>R$ 100,00</Text>

                </Box>
                <Button
                  onClick={() => BuySetTipsHandle('100,00', '2')}
                  marginTop={'10px'}
                  width={'120px'} borderRadius={'60px'} backgroundColor={'white'}
                  colorScheme={'white'} fontWeight='bold' fontStyle={'italic'}
                  fontFamily='revert'
                  color={'black'}>
                  Inscrever-se
                </Button>
              </Box>

            </Center>
            {link.indexOf("https") != -1 &&
              <Center width={'50%'} bg={'#00FF00'} marginTop={'20px'} borderRadius={'20px'} >
                <Box color='black'>
                  <Link color='teal.500' href={link}>
                    Clique aqui para pagar
                  </Link>
                </Box>
              </Center>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={modalOption}
        onClose={FinishBetting}
      >
        <ModalOverlay />
        <ModalContent boxShadow='lg' bg={'#292929'} borderRadius={'25px'} >
          <Center flexDirection={'column'} display={'flex'}>
            <Text fontSize='sm' color={'gray'} fontWeight={'550'} marginTop={'20px'}>{gameSelectedBet.match_matchDate.split(' ')[2]}</Text>
          </Center>
          <ModalCloseButton color={'white'} />
          <ModalBody borderRadius={'20px'} bg={'#292929'} pb={6} flexDirection={'column'} alignItems='center' justifyContent='space-between' display={'flex'}>
            <Stack direction='row' spacing={4}>
              <Center flexDirection={'column'} display={'flex'}>

                <Center flexDirection={'row'} display={'flex'}>
                  <Center  >
                    <Center margin={'10px'} width={'165px'} >
                      <Text fontSize='2xl' fontWeight={'550'} >{gameSelectedBet.match_team1}</Text>
                    </Center>

                    <Box margin={'2px'}   >
                      <Text fontSize='2xl' fontWeight={'550'}>x</Text>
                    </Box>

                    <Center margin={'10px'} width={'165px'}  >
                      <Text fontSize='2xl' fontWeight={'550'}>{gameSelectedBet.match_team2}</Text>
                    </Center>
                  </Center>
                </Center>

                {tipoOption === 'Vencedor da partida' &&
                  <Center marginTop={'15px'} width={'440px'} bg={'transparent'} borderColor={'gray'}
                    borderRadius={'4px'} borderBottomWidth={'1px'} borderTopWidth={'1px'} flexDirection={'column'}>
                    <Center width={'440px'} height={'60px'} bg={'transparent'} borderColor={'gray'} borderRadius={'4px'} borderBottomWidth={'1px'} borderTopWidth={'1px'} flexDirection={'column'}>
                      <Center borderTopRadius={'4px'} bg={'#1e1e1e'} width={'100%'} height={'50px'}>
                        <Text fontWeight={'550'}>Vencedor da partida  </Text>
                      </Center>
                      <RadioGroup height={'50px'} marginTop={'5px'} marginBottom={'5px'} marginRight={'20px'} onChange={(value) => setValueWinner(value)} value={allTips.winner.tipWinnerOrDraw}>
                        <Stack direction='row'>
                          <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='1'>{gameSelectedBet.match_team1}</Radio>
                          <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='2'>{gameSelectedBet.match_team2}</Radio>
                          <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='0'>Empate</Radio>
                        </Stack>
                      </RadioGroup>
                    </Center>

                  </Center>}
                {tipoOption === 'Placar de um time' &&
                  <Center marginTop={'20px'} width={'440px'} height={'60px'} bg={'transparent'} borderColor={'gray'} borderRadius={'4px'} borderBottomWidth={'1px'} borderTopWidth={'1px'} flexDirection={'column'}>
                    <Center borderTopRadius={'4px'} bg={'#1e1e1e'} width={'100%'} height={'50px'}>
                      <Text fontWeight={'550'}>Placar de um time</Text>
                    </Center>
                    <Center marginBottom={'10px'} marginTop={'5px'}>
                      <RadioGroup marginBottom={'10px'} marginRight={'15px'} onChange={(value) => setValueHalfScoreTipHalfScoreTeam(value)} value={allTips.halfScore.tipHalfScoreTeam}>
                        <Stack direction='row'>
                          <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='1'>{gameSelectedBet.match_team1}</Radio>
                          <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='2'>{gameSelectedBet.match_team2}</Radio>
                        </Stack>
                      </RadioGroup>
                      <Input onChange={(e) => setValueHalfScoreTipHalfScore(e.target.value)} marginBottom={'10px'} width={'50px'} height={'30px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} value={allTips.halfScore.tipHalfScore} name='name' focusBorderColor={'white'} />
                    </Center>

                  </Center>
                }
                {tipoOption === 'Placar da partida' &&
                  <Center marginTop={'15px'} width={'440px'} height={'90px'} bg={'transparent'} borderColor={'gray'}
                    borderRadius={'4px'} borderBottomWidth={'1px'} borderTopWidth={'1px'} flexDirection={'column'}>
                    <Center borderTopRadius={'4px'} bg={'#1e1e1e'} width={'100%'} height={'50px'}>
                      <Text fontWeight={'550'}>Placar da partida </Text>
                    </Center>
                    <Center marginBottom={'25px'} marginTop={'10px'}>
                      <Center marginBottom={'25px'} marginTop={'10px'}>
                        <Box flexDirection={'row'} display={'flex'}>
                          <Text fontSize='18px' marginRight={'10px'} >{gameSelectedBet.match_team1}</Text>

                          <Input value={allTips.fullScore.tipFullScoreTeam1} onChange={(value) => setValuefullScoreTipFullScoreTeam1(value.target.value)} marginRight={'20px'} width={'50px'} height={'30px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} name='name' focusBorderColor={'white'} />
                          <Text fontSize='18px' marginRight={'10px'} >{gameSelectedBet.match_team2}</Text>

                          <Input value={allTips.fullScore.tipFullScoreTeam2} onChange={(value) => setValuefullScoreTipFullScoreTeam2(value.target.value)} width={'50px'} height={'30px'} bg={'#1F1F1F'} borderRadius={'8px'} color={'white'} borderColor={'#1F1F1F'} name='name' focusBorderColor={'white'} />
                        </Box></Center>
                    </Center>
                  </Center>
                }
                <Button marginBottom={'10px'} marginTop={'15px'}
                  height={'30px'}
                  //isLoading={toCompare(item)}
                  onClick={() => ConfimTipsHandle(gameSelectedBet.match_id)}
                  borderRadius={'60px'}
                  backgroundColor={'#00FF00'}
                  colorScheme={'#00FF00'}
                  fontWeight='bold'
                  fontStyle={'italic'}
                  fontFamily={'roboto'}
                  color={'black'}>
                  CONFIRMAR PALPITE
                </Button>
              </Center>
            </Stack>

          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={loading}
        onClose={() => function () { }}
      >
        <ModalOverlay />
        <ModalContent boxShadow='lg' bg={'#292929'} borderRadius={'25px'} >
          <ModalHeader borderRadius={'20px'} bg={'#292929'} color={'white'}></ModalHeader>
          <ModalBody borderRadius={'20px'} bg={'#292929'} pb={6} flexDirection={'column'} alignItems='center' justifyContent='space-between' display={'flex'}>
            <Stack direction='row' spacing={4}>
              <Button bg={'#292929'} isLoading colorScheme='#292929' variant='solid'>

              </Button>

            </Stack>

          </ModalBody>
        </ModalContent>
      </Modal>

      {userDetail.status ?
        <>
          {userDetail.isAdmin ?
            <Text color={'white'}>ADMIN</Text>
            : <>

              <Center margin={'20px'}   >
                <Heading as='em' width={'350px'} fontSize={'40px'} fontFamily={'roboto'} color={'#00FF00'}  >{dayGame.toUpperCase()}</Heading>
              </Center>
              <Box className={styles.content}   >

                <Box marginBottom={'20px'} height={'290px'} borderRadius={'15px'} boxShadow='lg' width={'250px'} bg={'#1F1F1F'} alignItems={'center'} display={'flex'} flexDirection={'column'} >
                  <Heading overflow={'hidden'} textOverflow={'ellipsis'} width={'85%'} height={'30px'} marginTop={'15px'} as='h3' fontSize={'25px'} marginLeft={'5px'} fontFamily={'roboto'} fontStyle={'italic'}>{user.name.toUpperCase()}</Heading>
                  <Box margin={'15px 5px 0px 0px'} alignItems={'center'} display={'flex'} flexDirection={'row'} >
                    <Heading as='h5' size='sm' fontStyle={'italic'}>PALPITES ATUAL:</Heading>
                    <Heading margin={'2px 3px 0px'} as='h6' size='xs' fontWeight={'normal'} fontStyle={'italic'} color={'#00FF00'}> {dayGame === 'Próximos jogos' ? (parseInt(userDetail.baseTips) * matchSelectView.length) : '8'} palpites</Heading>
                  </Box>
                  <Box margin={'15px 5px 0px 10px'} alignItems={'center'} display={'flex'} flexDirection={'row'} >
                    <Heading as='h5' size='sm' fontStyle={'italic'}>PALPITES EXTRAS:</Heading>
                    <Heading margin={'2px 3px 0px'} as='h6' size='xs' fontWeight={'normal'} fontStyle={'italic'} color={'#00FF00'}>{userDetail.extraTipsAmount} palpites</Heading>
                  </Box>
                  <Button onClick={() => setMoreTipsModal(true)} borderRadius={'60px'} fontSize={'12px'} backgroundColor={'white'} colorScheme={'white'} fontWeight='bold' fontStyle={'italic'} margin={'15px 0px 0px 10px'} fontFamily={'roboto'} color={'black'}>
                    <Heading as='h6' size='xs' color={'black'} fontStyle={'italic'}>MAIS PALPITES POR R$ 5,00 </Heading>
                  </Button>
                  <Box marginTop={'20px'} marginBottom={'5px'} bg={'#494949'} width={'80%'} borderRadius={'20px'} height={'2px'}>
                  </Box>
                  <Button onClick={() => setDayGameNext('Próximos jogos')} marginRight={'60px'} width={'120px'} borderRadius={'60px'} backgroundColor={'#1F1F1F'} colorScheme={'#1F1F1F'} fontFamily={'roboto'} >
                    <Heading as='h4' size='md' color={dayGame === 'Próximos jogos' ? 'white' : 'gray'} fontWeight='700' fontFamily={'roboto'}>Próximos jogos </Heading>
                  </Button>
                  <Button onClick={() => setDayGameNow('Jogos passados')} width={'120px'} borderRadius={'60px'} marginRight={'55px'} backgroundColor={'#1F1F1F'} colorScheme={'#1F1F1F'} fontWeight='bold' fontFamily={'roboto'} >
                    <Heading as='h4' size='md' color={dayGame === 'Jogos passados' ? 'white' : 'gray'} fontWeight='700' fontFamily={'roboto'}>Jogos passados </Heading>
                  </Button>


                </Box>





                {matchSelectView.length > 0 &&
                  <Center bg={'transparent'} marginBottom={'20px'} borderRadius={'15px'} alignItems={'center'} display={'flex'} flexDirection={'column'} >

                    {matchSelectView.map((item: IMatchMap) => (
                      <Box key={item.match_id}>
                        <Center bg={'transparent'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                          <Text marginBottom={'10px'} color={'gray'} fontWeight={'450'}>{item.match_matchDate.split(' ')[0]} {item.match_matchDate.split(' ')[1].slice(0, 5)}</Text>

                        </Center>
                        <Center borderRadius={'15px'} boxShadow='lg' bg={'#292929'} marginBottom={'20px'} width={'400px'} alignItems={'center'} display={'flex'} flexDirection={'column'}>

                          <Text fontSize='sm' color={'gray'} fontWeight={'450'} marginTop={'20px'}>{item.match_matchDate.split(' ')[2]}</Text>
                          <Center flexDirection={'row'} display={'flex'}>
                            <Center  >
                              <Center margin={'10px'} width={'165px'} >
                                <Text fontSize='2xl' fontWeight={'550'}>{item.match_team1}</Text>
                              </Center>
                              <Box margin={'0px'}  >
                                <Text fontSize='2xl' fontWeight={'550'}>{item.match_finalTeam1Score === 'x' ? '' : item.match_finalTeam1Score}</Text>
                              </Box>
                              <Box margin={'2px'}   >
                                <Text fontSize='2xl' fontWeight={'550'}>x</Text>
                              </Box>
                              <Box margin={'0px'}  >
                                <Text fontSize='2xl' fontWeight={'550'}>{item.match_finalTeam2Score === 'x' ? '' : item.match_finalTeam2Score}</Text>
                              </Box>
                              <Center margin={'10px'} width={'165px'}  >
                                <Text fontSize='2xl' fontWeight={'550'}>{item.match_team2}</Text>
                              </Center>
                            </Center>
                          </Center>
                          {item.match_status === '0' ?
                            <Button marginBottom={'25px'} width={'150px'}
                              height={'30px'}
                              isLoading={toCompare(item)}
                              onClick={() => MotalTipsHandler(item)}
                              borderRadius={'60px'}
                              backgroundColor={'#00FF00'}
                              colorScheme={'#00FF00'}
                              fontWeight='bold'
                              fontStyle={'italic'}
                              fontFamily={'roboto'}
                              color={'black'}>
                              Ver Palpites
                            </Button> :
                            <>{item.match_status === '1' ?
                              <Button marginBottom={'25px'} width={'150px'}
                                height={'30px'}
                                //isDisabled={item.match_status === '1'}
                                //isLoading={toCompare(item)}
                                //onClick={() => MotalTipsHandler(item)}
                                borderRadius={'60px'}
                                backgroundColor={'#00FF00'}
                                colorScheme={'#00FF00'}
                                fontWeight='bold'
                                fontStyle={'italic'}
                                fontFamily={'roboto'}
                                color={'black'}>
                                Bola Rolando
                              </Button> :
                              <Button marginBottom={'25px'} width={'150px'}
                                height={'30px'}
                                //isDisabled={item.match_status === '1'}
                                //isLoading={toCompare(item)}
                                //onClick={() => MotalTipsHandler(item)}
                                borderRadius={'60px'}
                                backgroundColor={'#00FF00'}
                                colorScheme={'#00FF00'}
                                fontWeight='bold'
                                fontStyle={'italic'}
                                fontFamily={'roboto'}
                                color={'black'}>
                                Jogo Finalizado
                              </Button>
                            }</>

                          }


                        </Center></Box>
                    ))}

                  </Center>
                }









                <Box height={'250%'} borderRadius={'15px'} boxShadow='lg' width={'250px'} bg={'#1F1F1F'} alignItems={'center'} display={'flex'} flexDirection={'column'} >
                  <Heading overflow={'hidden'} textOverflow={'ellipsis'} marginBottom={'20px'} width={'85%'} height={'30px'} marginTop={'15px'} as='h3' fontSize={'25px'} marginLeft={'20px'} fontFamily={'roboto'} fontStyle={'italic'}>RANKING</Heading>
                  {spots.map((item: any, index: any) => (
                    <Center flexDirection={'row'} marginBottom={'20px'}>
                    <Box  width='20px' >
                    <Text fontWeight={'600'}>{parseInt(index)+1}.</Text>
                    </Box>
                    <Box 

lineHeight='tight'
noOfLines={1}  width={"130px"} marginRight={"10px"}  marginLeft={"10px"}>
                    <Text >{item.ranking_name.toUpperCase()}</Text>
                    </Box>
                    <Box >
                    <Text color={'#00FF00'} fontWeight={'550'}>{item.ranking_spots - 25} pts.</Text>
                    </Box>
                    </Center>
                  

                  ))}

                  <Box height={'1px'} borderRadius={'80px'} bg='gray' width={'90%'}></Box>


{spots.map((item: any, index: any) => (<>
    {item.ranking_name === user.name &&
                    <Center marginTop={'20px'} flexDirection={'row'} marginBottom={'20px'}>
                     
                    <Box  width='20px' >
                    <Text fontWeight={'600'}>{index}.</Text>
                    </Box>
                    <Box 

lineHeight='tight'
noOfLines={1}  width={"130px"} marginRight={"10px"}  marginLeft={"10px"}>
                    <Text >{item.ranking_name.toUpperCase()}</Text>
                    </Box>
                    <Box >
                    <Text color={'#00FF00'} fontWeight={'550'}>{item.ranking_spots - 25} pts.</Text>
                    </Box>
                    </Center>}</>
                  

                  ))}
                </Box>
              </Box>
            </>
          }</> : <></>
      }

    </>
  )
}

export default observer(Dashboard)

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get(`/SweepstakesMatch/matchByDateTomorrow?dateNow=${dateNow()}`)
  //console.log(`/SweepstakesMatch/all?dateTomorrow=${dateTomorrow()}&dateNow=${dateNow()}`)

  if (response.data.length > 0) {

    return {
      props: {
        matchNow: response.data
      }
    }
  } else {

    return {
      props: {
        matchNow: []
      }
    }
  }

})

//<Box height={'250%'} borderRadius={'15px'} boxShadow='lg' width={'250px'} bg={'#1F1F1F'} alignItems={'center'} display={'flex'} flexDirection={'column'} >
//                  <Heading overflow={'hidden'} textOverflow={'ellipsis'} width={'85%'} height={'30px'} marginTop={'15px'} as='h3' fontSize={'25px'} marginLeft={'20px'} fontFamily={'roboto'} fontStyle={'italic'}>RANKING GERAL</Heading>
//                  <RadioGroup onChange={(value) => setTypeRaking(value)} margin={'25px   75px 25px 0px'} defaultValue={typeRaking}>
//                    <Stack>
//                      <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='Ranking Geral'>Raking Geral</Radio>
//                      <Radio _checked={{ bg: '#00FF00', color: '#00FF00', borderColor: 'black' }} borderColor={'white'} borderWidth={'1px'} value='Ranking Diário'>Raking Diário</Radio>
//                    </Stack>
//                  </RadioGroup>
//
//                </Box>