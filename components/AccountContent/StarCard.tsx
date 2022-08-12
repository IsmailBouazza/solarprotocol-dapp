import {
  Flex,
  VStack,
  Text,
  Divider,
  Grid,
  Tooltip,
  Spinner,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount, useBalance, useContractWrite } from 'wagmi'
import {
  costPerTier,
  diamondContractConfig,
  palette,
  presaleContractConfig,
  secondsByDuration,
} from '../../config/constants'
import { IStarCardProps } from '../../config/types'
import { SolarContext } from '../../context/SolarContext'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
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

  const { UserState, StarTypes } = useContext(SolarContext)

  const [starCount, setStarCount] = useState<number | undefined>()
  const [rewardsPerSecond, setRewardsPerSeonc] = useState(0)
  const [claimable, setClaimable] = useState<number | undefined>()

  const tierInfo = useMemo(() => {
    if (!StarTypes.types) return
    const res = StarTypes.types.filter((val) => val.id === tier)[0]
    return res
  }, [StarTypes.types, tier])

  const { balanceToNumber, toFormattedValue, parseErrorReason } =
    useWeb3Formatter()

  useEffect(() => {
    if (!UserState.stars) return
    const length = UserState.stars.filter((val) => val.typeId === tier).length
    setStarCount(length ? length : 0)
  }, [UserState, tier])

  useEffect(() => {
    if (!StarTypes.types) return
    const rewards = StarTypes.types.filter((val) => val.id === tier)[0]
    if (!rewards) return
    setRewardsPerSeonc(rewards.rewardsPerSecond)
  }, [StarTypes.types, tier])

  useEffect(() => {
    if (!UserState.stars) return
    let claimable = 0
    UserState.stars.map((val) => {
      if (val.typeId === tier) claimable += val.pendingRewards
    })
    setClaimable(balanceToNumber(claimable, 18))
  }, [UserState.stars, balanceToNumber, tier])

  const { address } = useAccount()
  const [balance, setBalance] = useState<number>(0)
  const {} = useBalance({
    addressOrName: address ? address : ethers.constants.AddressZero,
    token: presaleContractConfig.addressOrName,
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
        console.error(`⭐ ${tier}} error: `, error.name)
        toast.error(error.name, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        return
      }
      if (!data) return
      toast.promise(data.wait(1), {
        pending: `💫 Redeeming a ${tierInfo?.name}.`,
        success: `💫 Redeemed a ${tierInfo?.name}.`,
        error: '💥 Redeeming failed.',
      })
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
        {starCount === undefined ? (
          <Spinner size="sm" color="white" justifySelf={'end'} />
        ) : (
          <Text justifySelf={'end'}>{starCount}</Text>
        )}
        <Divider
          gridColumn={'1/-1'}
          borderBottomColor={'#984a34'}
          opacity={1}
        />

        <Text textAlign="start" w="full">
          Claimable:
        </Text>
        {claimable === undefined ? (
          <Spinner size="sm" color="white" justifySelf={'end'} />
        ) : (
          <Text justifySelf={'end'}>
            {' '}
            {toFormattedValue(claimable)} $KELVIN
          </Text>
        )}

        <Text textAlign="start" w="full">
          Daily:
        </Text>
        {starCount === undefined ? (
          <Spinner size="sm" color="white" justifySelf={'end'} />
        ) : (
          <Text justifySelf={'end'}>
            {balanceToNumber(
              rewardsPerSecond * starCount * secondsByDuration['day'],
              18
            ).toFixed(2)}{' '}
            $KELVIN
          </Text>
        )}

        <Text textAlign="start" w="full">
          Weekly:
        </Text>
        {starCount === undefined ? (
          <Spinner size="sm" color="white" justifySelf={'end'} />
        ) : (
          <Text justifySelf={'end'}>
            {balanceToNumber(
              rewardsPerSecond * starCount * secondsByDuration['week'],
              18
            ).toFixed(2)}{' '}
            $KELVIN
          </Text>
        )}
        <Text textAlign="start" w="full">
          Monthly:
        </Text>
        {starCount === undefined ? (
          <Spinner size="sm" color="white" justifySelf={'end'} />
        ) : (
          <Text justifySelf={'end'}>
            {balanceToNumber(
              rewardsPerSecond * starCount * secondsByDuration['month'],
              18
            ).toFixed(2)}{' '}
            $KELVIN
          </Text>
        )}
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
          {costPerTier[tier] > balance ? (
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
