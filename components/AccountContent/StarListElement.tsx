import { Grid, Text, useMediaQuery, VStack } from '@chakra-ui/react'
import moment from 'moment'
import { dateMask, palette } from '../../config/constants'
import useMounted from '../../hooks/useMounted'
import NetworkButton from '../NetworkButton'

export default function StarListElement() {
  const mounted = useMounted()
  const isLargerThan1400 = useMediaQuery('(min-width: 1400px)')[0]

  if (isLargerThan1400)
    return (
      <>
        <Text>85</Text>
        <Text>Proton</Text>
        <Text>{mounted && moment(1659273274000).format(dateMask)}</Text>
        <Text>{mounted && moment(1659273274000).format(dateMask)}</Text>
        <Text>17.06 $KELVIN</Text>
        <VStack w="full">
          <NetworkButton w="full" size={'xs'} variant="solid3">
            Claim
          </NetworkButton>
          <NetworkButton w="full" size={'xs'} variant="solid3">
            Pay fees
          </NetworkButton>
        </VStack>
      </>
    )
  return (
    <Grid
      rounded={'xl'}
      templateColumns={'1fr 1fr'}
      border={`1px solid ${palette.main.buttonLightBorder}`}
      p={4}
      gap={2}
      rowGap={2}
      w="full"
      alignItems={'start'}
      textAlign="start"
    >
      <Text fontWeight={'bold'}>#</Text>
      <Text>84</Text>

      <Text fontWeight={'bold'}>Tier</Text>
      <Text>Quasar</Text>

      <Text fontWeight={'bold'}>Maintenance due</Text>
      <Text>{mounted && moment(1659273274000).format(dateMask)}</Text>

      <Text fontWeight={'bold'}>Lifespan runs out</Text>
      <Text>{mounted && moment(1659273274000).format(dateMask)}</Text>

      <Text fontWeight={'bold'}>Rewards</Text>
      <Text>17.05 $KELVIN</Text>

      <NetworkButton w="full" size={'xs'} variant="solid3" gridColumn={'1/-1'}>
        Claim
      </NetworkButton>
      <NetworkButton w="full" size={'xs'} variant="solid3" gridColumn={'1/-1'}>
        Pay fees
      </NetworkButton>
    </Grid>
  )
}
