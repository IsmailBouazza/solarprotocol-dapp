import { Grid, HStack, Text, VStack } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { palette } from '../../config/constants'
import { IBalancerPool } from '../../config/types'
import { SolarContext } from '../../context/SolarContext'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import proton from '../../src/proto.png'
import quasar from '../../src/quasar.png'
import neutron from '../../src/neutron.png'
import Image, { StaticImageData } from 'next/image'

const imgs: { [key: number]: StaticImageData } = {
  1: proton,
  2: neutron,
  3: quasar,
}

export default function HomeContent({
  poolInfo,
  price,
}: {
  poolInfo: IBalancerPool
  price: number
}) {
  const [liquidity, setLiquidity] = useState(0)

  const { StarTypes } = useContext(SolarContext)
  const { balanceToNumber } = useWeb3Formatter()

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
      <VStack
        w="full"
        bg={palette.background.gradient}
        rounded={'xl'}
        p={4}
        justifyContent={'center'}
        border={`2px solid ${palette.main.buttonLightBorder}`}
      >
        <Text fontSize={'4xl'} textAlign={'center'}>
          $KELVIN <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
        </Text>
        <Grid templateColumns={'repeat(2,1fr)'} w="100%" justifyItems={'start'}>
          <Text alignSelf={'start'} fontWeight="bold">
            Market Cap
          </Text>
          <Text alignSelf={'end'}>
            ${(1000000 * price).toLocaleString('en-GB')}
          </Text>

          <Text alignSelf={'start'} fontWeight="bold">
            Liquidity
          </Text>
          <Text alignSelf={'end'}>${liquidity.toLocaleString('en-GB')}</Text>
          <Text alignSelf={'start'} fontWeight="bold">
            Total Supply
          </Text>
          <Text alignSelf={'end'}>
            {(1000000).toLocaleString('en-GB')} $KELVIN
          </Text>
          <Text alignSelf={'start'} fontWeight="bold">
            Price
          </Text>
          <Text alignSelf={'end'}>${price.toLocaleString('en-GB')}</Text>
        </Grid>
      </VStack>
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
        {StarTypes.types &&
          StarTypes.types.map((val) => {
            return (
              <HStack
                w="full"
                key={val.name}
                border={`2px solid ${palette.main.buttonLightBorder}`}
                rounded="xl"
                p={4}
                gap={4}
                className="smallglow"
              >
                <Image
                  src={imgs[val.id]}
                  objectFit="contain"
                  alt={'star logo'}
                  width="128px"
                  height={'128px'}
                />
                <VStack w="100%" alignItems={'start'}>
                  {/* <Tooltip label="Quasar" hasArrow> */}
                  <HStack>
                    <Text fontWeight={'bold'} fontSize="lg">
                      {val.name}
                    </Text>
                    {/* <FiInfo color="white" /> */}
                  </HStack>
                  {/* </Tooltip> */}
                  <Text>{balanceToNumber(val.price, 18)}</Text>
                  <Text>{balanceToNumber(val.stablePrice, 6)}</Text>
                  <Text>{val.id} </Text>
                </VStack>
              </HStack>
            )
          })}
      </VStack>
      <VStack
        w="full"
        bg={palette.background.gradient}
        rounded={'xl'}
        p={4}
        justifyContent={'center'}
        border={`2px solid ${palette.main.buttonLightBorder}`}
      >
        <Text fontSize={'4xl'} textAlign={'center'}>
          SOLAR <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
        </Text>
        <Grid templateColumns={'repeat(2,1fr)'} w="100%" justifyItems={'start'}>
          <Text alignSelf={'start'} fontWeight="bold">
            TVL
          </Text>
          <Text alignSelf={'end'}>
            ${(1000000 * price).toLocaleString('en-GB')}
          </Text>

          <Text alignSelf={'start'} fontWeight="bold">
            Proto Stars
          </Text>
          <Text alignSelf={'end'}>10</Text>
          <Text alignSelf={'start'} fontWeight="bold">
            Neutron Stars
          </Text>
          <Text alignSelf={'end'}>5</Text>
          <Text alignSelf={'start'} fontWeight="bold">
            Quasars
          </Text>
          <Text alignSelf={'end'}>10</Text>
        </Grid>
      </VStack>
    </Grid>
  )
}
