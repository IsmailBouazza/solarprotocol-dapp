import {
  Grid,
  Heading,
  HStack,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react'
import { FiInfo } from 'react-icons/fi'
import { palette } from '../../config/constants'
import NetworkButton from '../NetworkButton'
import StarCard from './StarCard'
import StarList from './StarList'

export default function AccountContent() {
  const walletGridColumns = useBreakpointValue({
    base: '1fr',
    lg: 'repeat(2,1fr)',
    '2xl': 'repeat(3,1fr)',
  })
  const starGridColumns = useBreakpointValue({
    base: '1fr',
    lg: 'repeat(2,1fr)',
    '2xl': 'repeat(3,1fr)',
  })

  return (
    <>
      <VStack w="full" mx={'15%'} px={'5%'}>
        <Heading fontWeight={'normal'}>
          <b>Disclaimer:</b> This is a beta website and does not represent real
          values.
        </Heading>
        <Grid
          gap={6}
          w={'full'}
          alignItems="center"
          justifyContent="center"
          rounded="xl"
          py={4}
          bg={palette.background.gradient}
          templateColumns={walletGridColumns}
          justifyItems="center"
          fontSize={'2xl'}
          border={`1px solid ${palette.main.buttonBorder}`}
          boxShadow={` rgba(255, 255, 255, 0.25) 0px 0px 25px`}
        >
          <VStack fontWeight={'bold'}>
            <Tooltip label="Amount of $KELVIN yet to claim." hasArrow>
              <HStack>
                <Text>Claimable $KELVIN</Text>
                <FiInfo color="white" />
              </HStack>
            </Tooltip>
            <Text color={palette.main.buttonLightBorder}>3.14</Text>
            <Text fontSize={'xs'}>~ $210.57</Text>
          </VStack>
          <VStack fontWeight={'bold'}>
            <Text>Daily emissions</Text>
            <Text color={palette.main.buttonLightBorder}>1.32</Text>
            <Text fontSize={'xs'}>~ $92.15</Text>
          </VStack>
          <NetworkButton
            backgroundColor={'#081429'}
            rounded="lg"
            color={palette.main.buttonLightBorder}
          >
            CLAIM ALL
          </NetworkButton>
        </Grid>
        <Grid w="full" templateColumns={starGridColumns} gap={6} py={6}>
          <StarCard tier={1} />
          <StarCard tier={2} />
          <StarCard tier={3} />
        </Grid>
        <StarList />
      </VStack>
    </>
  )
}
