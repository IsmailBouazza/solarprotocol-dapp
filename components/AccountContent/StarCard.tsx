import { Flex, VStack, Text, Divider, Grid } from '@chakra-ui/react'
import { useCallback } from 'react'
import { palette } from '../../config/constants'
import { IStarCardProps } from '../../config/types'
import NetworkButton from '../NetworkButton'

const Stars: IStarCardProps = {
  1: {
    starName: 'Proto Star',
    video: './proto.mov',
  },
  2: {
    starName: 'Neutron',
    video: './neutron.mov',
  },
  3: {
    starName: 'Quasar',
    video: './quasar.mov',
  },
}

export default function StarCard({ tier }: { tier: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleContextMenu = useCallback((event: any) => {
    event.preventDefault()
  }, [])
  return (
    <VStack
      bg={palette.background.gradient}
      fontSize={'md'}
      border={`1px solid ${palette.main.buttonBorder}`}
      boxShadow={` rgba(255, 255, 255, 0.25) 0px 0px 25px`}
      rounded="xl"
      p={6}
      fontWeight={550}
    >
      <Text fontWeight={'bold'} textAlign="center" fontSize={'2xl'}>
        {Stars[tier].starName.toUpperCase()}
      </Text>
      <Flex
        width="100%"
        rounded={'xl'}
        h="full"
        overflow="hidden"
        border={`1px solid ${palette.main.buttonBorder}`}
        style={{ transform: tier === 3 ? 'scaleX(-1)' : '' }}
        justifyContent="center"
      >
        <video
          autoPlay
          muted
          loop
          controls={false}
          playsInline
          preload="auto"
          onContextMenu={handleContextMenu}
        >
          <source src={Stars[tier].video} type="video/mov" />
        </video>
      </Flex>
      <VStack
        bg={palette.background.gradient}
        p={2}
        rounded="md"
        border={`1px solid ${palette.main.buttonBorder}`}
        boxShadow={` rgba(255, 255, 255, 0.25) 0px 0px 15px`}
        w="full"
      >
        <Grid templateColumns={'repeat(2,1fr)'} w="full" rowGap={2}>
          <Text textAlign="start" w="full">
            Owned:
          </Text>
          <Text justifySelf={'end'}>1</Text>

          <Divider
            gridColumn={'1/-1'}
            borderBottomColor={'#984a34'}
            opacity={1}
          />

          <Text textAlign="start" w="full">
            Claimable:
          </Text>
          <Text justifySelf={'end'}> 5$KELVIN</Text>

          <Divider
            gridColumn={'1/-1'}
            borderBottomColor={'#984a34'}
            opacity={1}
          />

          <Text textAlign="start" w="full">
            Daily:
          </Text>
          <Text justifySelf={'end'}>0.25$KELVIN</Text>

          <Text textAlign="start" w="full">
            Weekly:
          </Text>
          <Text justifySelf={'end'}>1.75$KELVIN</Text>
          <Text textAlign="start" w="full">
            Monthly:
          </Text>
          <Text justifySelf={'end'}> 7.50$KELVIN</Text>
        </Grid>
      </VStack>

      <NetworkButton
        w="full"
        p={4}
        variant="solid3"
        border={`2px solid ${palette.main.buttonBorder}`}
      >
        Redeem
      </NetworkButton>
    </VStack>
  )
}
