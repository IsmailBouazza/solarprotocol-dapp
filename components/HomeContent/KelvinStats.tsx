import { VStack, Grid, Text } from '@chakra-ui/react'
import { palette } from '../../config/constants'

export default function KelvinStats({
  price,
  liquidity,
}: {
  price: number
  liquidity: number
}) {
  return (
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
  )
}
