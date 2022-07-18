import {
  Divider,
  Grid,
  HStack,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react'
import { palette } from '../../config/constants'
import NetworkButton from '../NetworkButton'
import StarListElement from './StarListElement'

export default function StarList() {
  const isLargerThan1400 = useMediaQuery('(min-width: 1400px)')[0]
  return (
    <VStack
      w="full"
      border={`1px solid ${palette.main.buttonLightBorder}`}
      rounded="xl"
      bg={palette.background.gradient}
      p={4}
    >
      <HStack w="full" justifyContent={'space-between'}>
        <Text color={palette.main.title}>Created Stars</Text>
        <HStack>
          <NetworkButton variant={'solid3'} size="xs">
            Claim all
          </NetworkButton>
        </HStack>
      </HStack>
      <Divider borderBottomColor={palette.main.buttonLightBorder} opacity={1} />
      <Grid
        templateColumns={
          isLargerThan1400
            ? '50px 100px repeat(4, 1fr)'
            : { base: '1fr', lg: 'repeat(2,1fr)', '2xl': 'repeat(3,1fr)' }
        }
        w="full"
        rowGap={4}
        gap={4}
        alignItems="center"
      >
        {isLargerThan1400 && (
          <>
            <Text fontWeight={'bold'}>No.</Text>
            <Text fontWeight={'bold'}>Tier</Text>
            <Text fontWeight={'bold'}>Maintenance due</Text>
            <Text fontWeight={'bold'}>Lifespan runs out</Text>
            <Text fontWeight={'bold'}>Rewards</Text>
            <Text fontWeight={'bold'}></Text>
          </>
        )}

        {/* <Divider
          borderBottomColor={palette.main.buttonLightBorder}
          opacity={1}
          gridColumn={'1/-1'}
        /> */}
        <StarListElement />
        <StarListElement />
        <StarListElement />
        <StarListElement />
      </Grid>
    </VStack>
  )
}
