import { Grid, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { erc20ABI, useContractWrite } from 'wagmi'
import { toast } from 'react-toastify'
import {
  diamondContractConfig,
  palette,
  USDCAddress,
} from '../../config/constants'
import { IAPY, IBalancerPool } from '../../config/types'
import { SolarContext } from '../../context/SolarContext'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import NetworkButton from '../NetworkButton'
import KelvinStats from './KelvinStats'
import MintStarCard from './MintStarCard'
import SolarStats from './SolarStats'
import { ethers } from 'ethers'

export default function HomeContent({
  poolInfo,
  price,
  apys,
}: {
  poolInfo: IBalancerPool
  price: number
  apys: IAPY[]
}) {
  const [liquidity, setLiquidity] = useState(0)

  const { StarTypes, UserState } = useContext(SolarContext)
  const { balanceToNumber } = useWeb3Formatter()

  const [selectedType, setSelectedType] = useState(0)

  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'createNode',
    args: [selectedType],
    onSettled(data, error) {
      if (error) {
        console.error(`⭐ ${selectedType} error: `, error.name)
        toast.error(error.name, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        return
      }
      if (!data) return
      toast.promise(data.wait(1), {
        pending: '🌟 Minting a Star.',
        success: '🌟 Star Minted.',
        error: '💥 Star minting failed.',
      })
    },
  })

  const { isLoading: isLoadingApprove, write: writeApprove } = useContractWrite(
    {
      addressOrName: USDCAddress,
      contractInterface: erc20ABI,
      functionName: 'approve',
      args: [diamondContractConfig.addressOrName, ethers.constants.MaxUint256],
      onSettled(data, error) {
        debugger
        if (error) {
          console.error(`🔐 USDC error: `, error.name)
          toast.error(`Approve USDC:  ${error.name}`, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
          return
        }
        if (!data) return
        toast.promise(data.wait(1), {
          pending: '🔒🔑 Approving USDC.',
          success: '🔓 USDC Approved.',
          error: '🔒❌ USDC Approval failed.',
        })
      },
    }
  )

  useEffect(() => {
    const usdc = poolInfo.data.pool.tokens.filter(
      (val) => val.symbol === 'USDC'
    )[0]
    const kelvin = poolInfo.data.pool.tokens.filter(
      (val) => val.symbol === 'KELVIN'
    )[0]
    const usdcValue = Number(usdc.balance)
    const kelvinValue = Number(kelvin.balance) * price
    const mcap = usdcValue + kelvinValue
    setLiquidity(mcap)
  }, [poolInfo, price])

  return (
    <Grid
      mx={'5%'}
      px={'5%'}
      w="full"
      templateColumns={{ base: '1fr', xl: 'repeat(2,1fr)' }}
      gap={4}
      rowGap={4}
    >
      <KelvinStats price={price} liquidity={liquidity} />
      <VStack
        gridRow={'span 2'}
        w="full"
        bg={palette.background.gradient}
        rounded={'xl'}
        p={4}
        minH="80vh"
        justifyContent={'center'}
        border={`2px solid ${palette.main.buttonLightBorder}`}
        gap={4}
      >
        <Text fontSize={'4xl'} textAlign={'center'}>
          Mint <b style={{ color: palette.main.buttonLightBorder }}>Stars</b>
        </Text>
        {StarTypes.loading ? (
          <Spinner size={'xl'} color="white" />
        ) : (
          <>
            {StarTypes.types &&
              StarTypes.types.map((val) => {
                if (val.id > 3) return
                return (
                  <MintStarCard
                    key={val.id}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    starType={val}
                  />
                )
              })}
            <HStack>
              {selectedType === 0 ? (
                <NetworkButton disabled variant="solid3">
                  Select a Star
                </NetworkButton>
              ) : (
                <>
                  {UserState.usdcAllowance === undefined ||
                  UserState.usdcAllowance <= 1000 ? (
                    <>
                      {isLoadingApprove ? (
                        <NetworkButton
                          isLoading
                          loadingText="Approving"
                          variant="solid3"
                        >
                          Approve $USDC
                        </NetworkButton>
                      ) : (
                        <NetworkButton
                          onClick={() => writeApprove()}
                          variant="solid3"
                        >
                          Approve $USDC
                        </NetworkButton>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  <>
                    {StarTypes.types &&
                      StarTypes.types.filter(
                        (val) => val.id === selectedType
                      ) && (
                        <>
                          {UserState.usdcBalance === undefined ||
                          UserState.usdcBalance <
                            balanceToNumber(
                              StarTypes.types.filter(
                                (val) => val.id === selectedType
                              )[0].stablePrice,
                              6
                            ) ? (
                            <NetworkButton disabled variant={'solid3'}>
                              Not enough $USDC{' '}
                            </NetworkButton>
                          ) : (
                            <>
                              {UserState.kelvinBalance === undefined ||
                              UserState.kelvinBalance <
                                balanceToNumber(
                                  StarTypes.types.filter(
                                    (val) => val.id === selectedType
                                  )[0].price,
                                  18
                                ) ? (
                                <>
                                  <NetworkButton disabled variant={'solid3'}>
                                    Not enough $KELVIN
                                  </NetworkButton>
                                </>
                              ) : (
                                <>
                                  {isLoading ? (
                                    <NetworkButton
                                      isLoading
                                      loadingText="Minting"
                                      variant="solid3"
                                    ></NetworkButton>
                                  ) : (
                                    <NetworkButton
                                      onClick={() => write()}
                                      variant="solid3"
                                      className="smallglow"
                                    >
                                      Mint
                                    </NetworkButton>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                  </>
                </>
              )}
            </HStack>
          </>
        )}
      </VStack>
      <SolarStats price={price} stars={StarTypes} apys={apys} />
    </Grid>
  )
}
