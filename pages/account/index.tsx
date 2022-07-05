import { Text, Grid, VStack, useBreakpointValue, Flex } from '@chakra-ui/react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import NetworkButton from '../../components/NetworkButton'
// import NetworkButton from '../../components/NetworkButton'
import { palette } from '../../config/constants'

const Account: NextPage = () => {
  const walletGridColumns = useBreakpointValue({
    base: '1fr',
    lg: 'repeat(2,1fr)',
    '2xl': 'repeat(4,1fr)',
  })
  const starGridColumns = useBreakpointValue({
    base: '1fr',
    lg: 'repeat(2,1fr)',
    '2xl': 'repeat(3,1fr)',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleContextMenu = useCallback((event: any) => {
    event.preventDefault()
  }, [])
  return (
    <>
      <Head>
        <title>Account | Solar Protocol</title>
      </Head>
      <VStack w="full" mx={'15%'} px={'5%'}>
        <Grid
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
            <Text>Net worth</Text>
            <Text color={palette.main.buttonLightBorder}>$5,141.92</Text>
            <Text fontSize={'xs'}>&nbsp; </Text>
          </VStack>
          <VStack fontWeight={'bold'}>
            <Text>$KELVIN Balance</Text>
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
        <Grid w="full" templateColumns={starGridColumns} gap={12} pt={6}>
          <VStack
            bg={palette.background.gradient}
            fontSize={'2xl'}
            border={`1px solid ${palette.main.buttonBorder}`}
            boxShadow={` rgba(255, 255, 255, 0.25) 0px 0px 25px`}
            rounded="xl"
            p={6}
          >
            <Text fontWeight={'bold'}>PROTO STAR</Text>
            <Flex width="100%" rounded={'xl'} h="full" overflow="hidden">
              <video
                autoPlay
                muted
                loop
                controls={false}
                onContextMenu={handleContextMenu}
              >
                <source src="/proto.mov" />
              </video>
            </Flex>
          </VStack>
          <VStack
            bg={palette.background.gradient}
            fontSize={'2xl'}
            border={`1px solid ${palette.main.buttonBorder}`}
            boxShadow={` rgba(255, 255, 255, 0.25) 0px 0px 25px`}
            rounded="xl"
            p={6}
          >
            <Text fontWeight={'bold'}>NEUTRON</Text>
            <Flex width="100%" rounded={'xl'} h="full" overflow="hidden">
              <video
                autoPlay
                muted
                loop
                controls={false}
                onContextMenu={handleContextMenu}
              >
                <source src="/neutron.mov" />
              </video>
            </Flex>
          </VStack>
          <VStack
            bg={palette.background.gradient}
            fontSize={'2xl'}
            border={`1px solid ${palette.main.buttonBorder}`}
            boxShadow={` rgba(255, 255, 255, 0.25) 0px 0px 25px`}
            rounded="xl"
            p={6}
          >
            <Text fontWeight={'bold'}>QUASAR</Text>
            <Flex width="100%" rounded={'xl'} h="full" overflow="hidden">
              <video
                autoPlay
                muted
                loop
                controls={false}
                onContextMenu={handleContextMenu}
              >
                <source src="/quasar.mov" />
              </video>
            </Flex>
          </VStack>
        </Grid>
      </VStack>
    </>
  )
}
export default Account
