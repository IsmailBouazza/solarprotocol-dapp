import {
  Divider,
  Grid,
  HStack,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react'
import { useContext, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useContractWrite } from 'wagmi'
import { diamondContractConfig, palette } from '../../config/constants'
import { SolarContext } from '../../context/SolarContext'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import NetworkButton from '../NetworkButton'
import StarListElement from './StarListElement'

export default function StarList() {
  const isLargerThan1400 = useMediaQuery('(min-width: 1400px)')[0]

  const { UserState } = useContext(SolarContext)
  const { parseErrorReason } = useWeb3Formatter()

  const stars = useMemo(() => {
    if (!UserState.stars) return
    return UserState.stars.map((val) => {
      return val.tokenId
    })
  }, [UserState.stars])

  const pendingRewards = useMemo(() => {
    let pending = 0
    if (!UserState.stars) return pending
    UserState.stars.map((val) => {
      pending = +val.pendingRewards
    })
    return pending
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
          {isLoading ? (
            <NetworkButton
              variant={'solid3'}
              size="xs"
              isLoading
              loadingText="Claiming"
            >
              Claim all
            </NetworkButton>
          ) : (
            <>
              {pendingRewards === 0 ? (
                <NetworkButton
                  variant={'solid3'}
                  size="xs"
                  onClick={() => write()}
                  disabled
                >
                  No rewards
                </NetworkButton>
              ) : (
                <NetworkButton
                  variant={'solid3'}
                  size="xs"
                  onClick={() => write()}
                >
                  Claim all
                </NetworkButton>
              )}
            </>
          )}
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
        {UserState.stars &&
          UserState.stars.map((val) => {
            return <StarListElement star={val} key={val.tokenId} />
          })}
      </Grid>
    </VStack>
  )
}
