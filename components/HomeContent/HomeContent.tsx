import { Grid, Text, VStack } from '@chakra-ui/react'
import { palette } from '../../config/constants'
import { IBalancerPool } from '../../config/types'

export default function HomeContent({ poolInfo }: { poolInfo: IBalancerPool }) {
  return (
    <VStack
      w="full"
      bg={palette.background.gradient}
      mx={'5%'}
      px={'5%'}
      rounded={'xl'}
    >
      <Text fontSize={'4xl'} textAlign={'center'}>
        Solar <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
      </Text>
      <Grid templateColumns={'repeat(2,1fr)'} w="50%">
        <Text alignSelf={'start'} fontWeight="bold">
          Market Cap
        </Text>
        <Text alignSelf={'end'}>${(122357).toLocaleString('en-GB')}</Text>

        <Text alignSelf={'start'} fontWeight="bold">
          Liquidity
        </Text>
        <Text alignSelf={'end'}>${(122357).toLocaleString('en-GB')}</Text>
        <Text alignSelf={'start'} fontWeight="bold">
          Total Supply
        </Text>
        <Text alignSelf={'end'}>
          {(1000000).toLocaleString('en-GB')} $KELVIN
        </Text>
        <Text alignSelf={'start'} fontWeight="bold">
          Price
        </Text>
        <Text alignSelf={'end'}>${(122357).toLocaleString('en-GB')}</Text>
      </Grid>
    </VStack>
  )
}
