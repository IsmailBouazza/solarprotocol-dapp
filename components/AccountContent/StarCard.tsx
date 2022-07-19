import { Flex, VStack, Text, Divider, Grid, Tooltip } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { useAccount, useBalance, useContractWrite } from 'wagmi'
import {
  costPerTier,
  diamondContractConfig,
  palette,
} from '../../config/constants'
import { IStarCardProps } from '../../config/types'
// import { toast } from 'react-toastify'
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

  const { address } = useAccount()
  const [balance, setBalance] = useState<number>(0)
  const {} = useBalance({
    addressOrName: address ? address : ethers.constants.AddressZero,
    token: '0x5a66Be10177c30Ae983792240E13401dF472822A',
    watch: true,
    chainId: 250,
    cacheTime: 5_000,
    staleTime: 5_000,
    onSuccess(data) {
      setBalance(Number(ethers.utils.formatUnits(data.value, 18)))
    },
  })

  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'createPresaleNode',
    args: [tier],
    onSettled(data, error) {
      if (error) {
        console.error(`⭐ ${tier} error: `, error)
        return
      }
      console.log(`⭐ ${tier} data: `, data)
    },
  })
  return (
    <VStack
      bg={palette.background.gradient}
      fontSize={'md'}
      border={`1px solid ${palette.main.buttonBorder}`}
      boxShadow={` rgba(255, 255, 255, 0.25) 0px 0px 25px`}
      rounded="xl"
      p={0}
      fontWeight={550}
    >
      <Flex
        width="100%"
        rounded={'xl'}
        roundedBottom="0px"
        h="full"
        overflow="hidden"
        justifyContent="center"
        borderBottom={`1px solid ${palette.main.buttonBorder}`}
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
          <source src={Stars[tier].video} />
        </video>
      </Flex>
      <Text fontWeight={'bold'} textAlign="center" fontSize={'xl'}>
        {Stars[tier].starName.toUpperCase()}
      </Text>

      <Grid templateColumns={'repeat(2,1fr)'} w="full" rowGap={2} p={2}>
        <Divider
          gridColumn={'1/-1'}
          borderBottomColor={'#984a34'}
          opacity={1}
        />
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
        <Text justifySelf={'end'}> 5 $KELVIN</Text>

        <Text textAlign="start" w="full">
          Daily:
        </Text>
        <Text justifySelf={'end'}>0.25 $KELVIN</Text>

        <Text textAlign="start" w="full">
          Weekly:
        </Text>
        <Text justifySelf={'end'}>1.75 $KELVIN</Text>
        <Text textAlign="start" w="full">
          Monthly:
        </Text>
        <Text justifySelf={'end'}> 7.50 $KELVIN</Text>
      </Grid>

      {isLoading ? (
        <NetworkButton
          rounded={'xl'}
          roundedTop="0px"
          w="full"
          p={4}
          variant="solid3"
          isLoading
          loadingText="Redeeming"
        >
          Redeem
        </NetworkButton>
      ) : (
        <>
          {costPerTier[tier] + 1 > balance ? (
            <Tooltip
              label="Not enough $nKELVIN"
              aria-label="Not enough $nKELVIN"
              hasArrow
            >
              <NetworkButton
                rounded={'xl'}
                roundedTop="0px"
                w="full"
                p={4}
                variant="solid3"
                disabled
              >
                Redeem
              </NetworkButton>
            </Tooltip>
          ) : (
            <NetworkButton
              rounded={'xl'}
              roundedTop="0px"
              w="full"
              p={4}
              variant="solid3"
              onClick={() => write()}
            >
              Redeem
            </NetworkButton>
          )}
        </>
      )}
    </VStack>
  )
}
