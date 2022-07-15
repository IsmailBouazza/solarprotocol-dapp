import { Text, VStack } from '@chakra-ui/react'
import useMounted from '../../hooks/useMounted'
import NetworkButton from '../NetworkButton'

export default function StarListElement() {
  const mounted = useMounted()
  return (
    <>
      <Text>85</Text>
      <Text>Proton</Text>
      <Text>{mounted && new Date(1659273274000).toLocaleDateString()}</Text>
      <Text>{mounted && new Date(1659273274000).toLocaleDateString()}</Text>
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
}
