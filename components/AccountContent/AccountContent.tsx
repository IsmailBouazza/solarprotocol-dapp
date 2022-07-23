import {
  Grid,
  HStack,
  Spinner,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useContractWrite } from 'wagmi'
import {
  diamondContractConfig,
  palette,
  secondsByDuration,
} from '../../config/constants'
import { SolarContext } from '../../context/SolarContext'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import NetworkButton from '../NetworkButton'
import StarCard from './StarCard'
import StarList from './StarList'

export default function AccountContent({ price }: { price: number }) {
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

  const { UserState, StarTypes } = useContext(SolarContext)
  const { toFormattedValue, balanceToNumber } = useWeb3Formatter()

  const [dailyEmissions, setDailyEmissions] = useState<undefined | number>()

  useEffect(() => {
    if (!StarTypes.types) return
    let emissions = 0
    StarTypes.types.map((val) => {
      if (!UserState.stars) return
      const typeEmissions =
        UserState.stars.filter((item) => item.typeId === val.id).length *
        val.rewardsPerSecond *
        secondsByDuration['day']
      emissions += typeEmissions
    })
    setDailyEmissions(balanceToNumber(emissions, 18))
  }, [StarTypes.types, UserState.stars, balanceToNumber])

  const [pendingRewards, setPendingRewards] = useState(0)
  useEffect(() => {
    if (!UserState.stars) return
    let rewards = 0
    UserState.stars.map((val) => {
      rewards += val.pendingRewards
    })
    setPendingRewards(balanceToNumber(rewards, 18))
  }, [UserState.stars, balanceToNumber])

  const { parseErrorReason } = useWeb3Formatter()

  const stars = useMemo(() => {
    if (!UserState.stars) return
    return UserState.stars.map((val) => {
      return val.tokenId
    })
  }, [UserState.stars])

  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'claimNodeRewards(uint256[])',
    args: [stars],
    onSettled(data, error) {
      if (error) {
        console.error(
          `⭐ Claiming all error: `,
          parseErrorReason(error.message)
        )
        toast.error(parseErrorReason(error.message), {
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
        pending: `💰 Claiming all rewards.`,
        success: `💸 Claimed all rewards`,
        error: '💥 Claiming all rewards failed.',
      })
    },
  })

  return (
    <>
      <VStack w="full" mx={'5%'} px={'5%'}>
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
              <HStack w="full" textAlign={'center'} p={2}>
                <Text>Claimable $KELVIN</Text>
                <FiInfo color="white" />
              </HStack>
            </Tooltip>
            {pendingRewards === 0 ? (
              <Spinner size="sm" color="white" />
            ) : (
              <>
                <Text color={palette.main.buttonLightBorder}>
                  {toFormattedValue(pendingRewards)}
                </Text>
                <Text fontSize={'xs'}>
                  ~ ${toFormattedValue(pendingRewards * price)}
                </Text>
              </>
            )}
          </VStack>
          <VStack fontWeight={'bold'}>
            <Text>Daily emissions</Text>
            {dailyEmissions === undefined ? (
              <Spinner size="sm" color="white" />
            ) : (
              <>
                <Text color={palette.main.buttonLightBorder}>
                  {toFormattedValue(dailyEmissions)}
                </Text>
                <Text fontSize={'xs'}>
                  ~ ${toFormattedValue(dailyEmissions * price)}
                </Text>
              </>
            )}
          </VStack>
          <VStack>
            {isLoading ? (
              <NetworkButton
                backgroundColor={'#081429'}
                rounded="lg"
                color={palette.main.buttonLightBorder}
                isLoading
                loadingText="Claiming"
              >
                CLAIM ALL
              </NetworkButton>
            ) : (
              <>
                {pendingRewards === 0 ? (
                  <NetworkButton
                    backgroundColor={'#081429'}
                    rounded="lg"
                    color={palette.main.buttonLightBorder}
                    onClick={() => write()}
                    disabled
                  >
                    NO REWARDS
                  </NetworkButton>
                ) : (
                  <NetworkButton
                    backgroundColor={'#081429'}
                    rounded="lg"
                    color={palette.main.buttonLightBorder}
                    onClick={() => write()}
                  >
                    CLAIM ALL
                  </NetworkButton>
                )}
              </>
            )}
            {StarTypes.claimTax === undefined ? (
              <Spinner color="white" size="md" />
            ) : (
              <Text fontSize={'lg'}>Claim tax: {StarTypes.claimTax}%</Text>
            )}
          </VStack>
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
