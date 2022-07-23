import { VStack, Grid, Text, Spinner } from '@chakra-ui/react'
import { useState } from 'react'
import { useContractReads } from 'wagmi'
import {
  diamondContractConfig,
  palette,
  vaultLiquidityAddress,
  vaultProjectAddress,
  vaultRewardsAddress,
  vaultTreasuryAddress,
} from '../../config/constants'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'

export default function KelvinStats({
  price,
  liquidity,
}: {
  price: number
  liquidity: number
}) {
  const [circulatingSupply, setCirculatingSupply] = useState<
    number | undefined
  >()
  const { balanceToNumber } = useWeb3Formatter()
  const {} = useContractReads({
    contracts: [
      {
        ...diamondContractConfig,
        functionName: 'balanceOf(address)',
        args: [vaultRewardsAddress],
      },
      {
        ...diamondContractConfig,
        functionName: 'balanceOf(address)',
        args: [vaultLiquidityAddress],
      },
      {
        ...diamondContractConfig,
        functionName: 'balanceOf(address)',
        args: [vaultProjectAddress],
      },
      {
        ...diamondContractConfig,
        functionName: 'balanceOf(address)',
        args: [vaultTreasuryAddress],
      },
    ],
    onSuccess(data) {
      let circulating = 0
      data.map((val) => (circulating += balanceToNumber(Number(val), 18)))
      setCirculatingSupply(1000000 - circulating)
    },
  })
  return (
    <VStack
      w="full"
      bg={palette.background.gradient}
      rounded={'xl'}
      p={4}
      justifyContent={'center'}
      position="relative"
      border={`2px solid ${palette.main.buttonLightBorder}`}
    >
      <Text fontSize={'4xl'} textAlign={'center'}>
        $KELVIN <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
      </Text>
      <Grid templateColumns={'repeat(2,1fr)'} w="100%" justifyItems={'start'}>
        <Text alignSelf={'start'} fontWeight="bold">
          Marketcap
        </Text>
        {circulatingSupply === undefined ? (
          <Spinner size="xs" color="white" />
        ) : (
          <Text alignSelf={'end'}>
            ${(circulatingSupply * price).toLocaleString('en-GB')}
          </Text>
        )}

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
  )
}
