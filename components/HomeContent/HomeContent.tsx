import { Grid, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { useContractWrite } from 'wagmi'
import { toast } from 'react-toastify'
import { diamondContractConfig, palette } from '../../config/constants'
import { IBalancerPool } from '../../config/types'
import { SolarContext } from '../../context/SolarContext'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import NetworkButton from '../NetworkButton'
import KelvinStats from './KelvinStats'
import MintStarCard from './MintStarCard'
import SolarStats from './SolarStats'

export default function HomeContent({
  poolInfo,
  price,
}: {
  poolInfo: IBalancerPool
  price: number
}) {
  const [liquidity, setLiquidity] = useState(0)

  const { StarTypes } = useContext(SolarContext)
  const { parseErrorReason } = useWeb3Formatter()

  const [selectedType, setSelectedType] = useState(0)

  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'createNode',
    args: [selectedType],
    onSettled(data, error) {
      if (error) {
        console.error(
          `⭐ ${selectedType} error: `,
          parseErrorReason(error.message)
        )
        toast.error(parseErrorReason(error.message), {
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
      console.log(`⭐ ${selectedType} data: `, data)
    },
  })

  useEffect(() => {
    const usdc = poolInfo.data.pool.tokens.filter(
      (val) => val.symbol === 'USDC'
    )[0]
    const kelvin = poolInfo.data.pool.tokens.filter(
      (val) => val.symbol === 'KNS'
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
                <NetworkButton disabled>Select a Star</NetworkButton>
              ) : (
                <>
                  {isLoading ? (
                    <NetworkButton
                      isLoading
                      loadingText="Minting"
                    ></NetworkButton>
                  ) : (
                    <NetworkButton onClick={() => write()}>Mint</NetworkButton>
                  )}
                </>
              )}
            </HStack>
          </>
        )}
      </VStack>
      <SolarStats price={price} />
    </Grid>
  )
}
