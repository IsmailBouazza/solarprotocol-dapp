import { VStack, Grid, Text, Spinner, Tooltip, Divider } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import { useBalance } from 'wagmi'
import {
  diamondContractConfig,
  palette,
  USDCAddress,
  vaultSPBAddress,
} from '../../config/constants'
import { IAPY, IStarTypes } from '../../config/types'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'

export default function SolarStats({
  price,
  stars,
  apys,
}: {
  price: number
  stars: IStarTypes
  apys: IAPY[]
}) {
  const { balanceToNumber, toFormattedValue } = useWeb3Formatter()
  const tvl = useMemo(() => {
    if (
      !stars.neutronCount ||
      !stars.quasarCount ||
      !stars.protoCount ||
      !stars.types
    )
      return undefined
    let value = 0
    stars.types.map((val) => {
      const typeValue =
        balanceToNumber(val.price, 18) * price +
        balanceToNumber(val.stablePrice, 6)
      if (val.id === 1 && stars.protoCount)
        value += typeValue * stars.protoCount
      else if (val.id === 2 && stars.neutronCount)
        value += typeValue * stars.neutronCount
      else if (val.id === 3 && stars.quasarCount)
        value += typeValue * stars.quasarCount
    })

    return value
  }, [
    balanceToNumber,
    price,
    stars.neutronCount,
    stars.protoCount,
    stars.quasarCount,
    stars.types,
  ])

  const SPBUSDCBalance = useBalance({
    addressOrName: vaultSPBAddress,
    chainId: 250,
    token: USDCAddress,
    watch: true,
    staleTime: 3_000,
  })

  const SPBKELVINBalance = useBalance({
    addressOrName: vaultSPBAddress,
    chainId: 250,
    token: diamondContractConfig.addressOrName,
    watch: true,
    staleTime: 3_000,
  })

  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <VStack
      w="full"
      bg={palette.background.gradient}
      rounded={'xl'}
      p={4}
      gap={4}
      justifyContent={'center'}
      border={`2px solid ${palette.main.buttonLightBorder}`}
    >
      <Text fontSize={'4xl'} textAlign={'center'}>
        SOLAR <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
      </Text>
      <Grid templateColumns={'repeat(2,1fr)'} w="100%" justifyItems={'start'}>
        {isOpen ? (
          <Tooltip label="TVL = Star count * Star value" hasArrow isOpen>
            <Text
              alignSelf={'start'}
              fontWeight="bold"
              display="flex"
              flexDirection={'row'}
              alignItems="center"
              gap={2}
              onClick={() => setIsOpen(false)}
            >
              TVL <FiInfo />
            </Text>
          </Tooltip>
        ) : (
          <Tooltip label="TVL = Star count * Star value" hasArrow>
            <Text
              alignSelf={'start'}
              fontWeight="bold"
              display="flex"
              flexDirection={'row'}
              alignItems="center"
              gap={2}
              onClick={() => setIsOpen(true)}
            >
              TVL <FiInfo />
            </Text>
          </Tooltip>
        )}

        {tvl === undefined ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Text alignSelf={'end'}>${tvl.toLocaleString('en-GB')}</Text>
        )}

        <Text alignSelf={'start'} fontWeight="bold">
          SPB $KELVIN
        </Text>
        {SPBKELVINBalance.isLoading ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Text alignSelf={'end'}>
            ${toFormattedValue(Number(SPBKELVINBalance.data?.formatted))}
          </Text>
        )}
        <Text alignSelf={'start'} fontWeight="bold">
          SPB $USDC
        </Text>
        {SPBUSDCBalance.isLoading ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Text alignSelf={'end'}>
            $
            {toFormattedValue(
              Number(
                ethers.utils.formatUnits(
                  SPBUSDCBalance.data?.value.toString() ?? '0',
                  6
                )
              )
            )}
          </Text>
        )}
      </Grid>
      <Divider w="80%" opacity={1} />
      <Grid templateColumns={'repeat(4,1fr)'} w="full" gap={2} rowGap={2}>
        <Text></Text>
        <Text fontWeight={'bold'}>PROTOSTAR</Text>
        <Text fontWeight={'bold'}>NEUTRON</Text>
        <Text fontWeight={'bold'}>QUASAR</Text>
        <Text fontWeight={'bold'}>COUNT</Text>
        <Text>{stars.protoCount}</Text>
        <Text>{stars.neutronCount}</Text>
        <Text>{stars.quasarCount}</Text>
        <Text fontWeight={'bold'}>APYs</Text>
        <Text>{apys.find((v) => v.id === 1)?.apy.toFixed(2)}%</Text>
        <Text>{apys.find((v) => v.id === 2)?.apy.toFixed(2)}%</Text>
        <Text>{apys.find((v) => v.id === 3)?.apy.toFixed(2)}%</Text>
      </Grid>
    </VStack>
  )
}
