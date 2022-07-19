import { VStack, Grid, Text } from '@chakra-ui/react'
import { palette } from '../../config/constants'
import { IStarTypes } from '../../config/types'

export default function SolarStats({
  price,
  stars,
}: {
  price: number
  stars: IStarTypes
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
        <Text alignSelf={'end'}>{stars.protoCount}</Text>
        <Text alignSelf={'start'} fontWeight="bold">
          Neutron Stars
        </Text>
        <Text alignSelf={'end'}>{stars.neutronCount}</Text>
        <Text alignSelf={'start'} fontWeight="bold">
          Quasars
        </Text>
        <Text alignSelf={'end'}>{stars.quasarCount}</Text>
      </Grid>
    </VStack>
  )
}
