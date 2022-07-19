import { Grid, Text, useMediaQuery, VStack } from '@chakra-ui/react'
// import moment from 'moment'
import { useContext, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useContractWrite } from 'wagmi'
import { diamondContractConfig, palette } from '../../config/constants'
import { IStar } from '../../config/types'
import { SolarContext } from '../../context/SolarContext'
// import useMounted from '../../hooks/useMounted'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import NetworkButton from '../NetworkButton'

export default function StarListElement({ star }: { star: IStar }) {
  // const mounted = useMounted()
  const isLargerThan1400 = useMediaQuery('(min-width: 1400px)')[0]

  const { balanceToNumber, toFormattedValue, parseErrorReason } =
    useWeb3Formatter()

  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'claimNodeRewards(uint256)',
    args: [star.tokenId],
    onSettled(data, error) {
      if (error) {
        console.error(
          `⭐ #${star.tokenId} error: `,
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
        pending: `💰 Claiming rewards for Star ${star.tokenId}.`,
        success: `💸 Rrewards claimed in Star ${star.tokenId}.`,
        error: '💥 Claiming rewards failed.',
      })
    },
  })

  const { StarTypes } = useContext(SolarContext)
  const type = useMemo(() => {
    if (!StarTypes.types) return
    return StarTypes.types.filter((val) => val.id === star.typeId)[0]
  }, [StarTypes.types, star.typeId])

  if (isLargerThan1400)
    return (
      <>
        <Text>{star.tokenId}</Text>
        <Text>{type && type.name}</Text>
        {/* <Text>{mounted && moment(1659273274000).format(dateMask)}</Text> */}
        {/* <Text>{mounted && moment(1659273274000).format(dateMask)}</Text> */}
        <Text>Coming Soon</Text>
        <Text>Coming Soon</Text>
        <Text>
          {toFormattedValue(balanceToNumber(star.pendingRewards, 18))} $KELVIN
        </Text>
        <VStack w="full">
          {isLoading ? (
            <NetworkButton
              w="full"
              size={'xs'}
              variant="solid3"
              gridColumn={'1/-1'}
              isLoading
              loadingText="Claiming"
            >
              Claim
            </NetworkButton>
          ) : (
            <NetworkButton
              w="full"
              size={'xs'}
              variant="solid3"
              gridColumn={'1/-1'}
              onClick={() => write()}
            >
              Claim
            </NetworkButton>
          )}
          {/* <NetworkButton w="full" size={'xs'} variant="solid3">
            Pay fees
          </NetworkButton> */}
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
      <Text>{star.tokenId}</Text>

      <Text fontWeight={'bold'}>Tier</Text>
      <Text>{type && type.name}</Text>

      <Text fontWeight={'bold'}>Maintenance due</Text>
      <Text>Coming Soon</Text>

      <Text fontWeight={'bold'}>Lifespan runs out</Text>
      <Text>Coming Soon</Text>

      <Text fontWeight={'bold'}>Rewards</Text>
      <Text>
        {toFormattedValue(balanceToNumber(star.pendingRewards, 18))} $KELVIN
      </Text>

      {isLoading ? (
        <NetworkButton
          w="full"
          size={'xs'}
          variant="solid3"
          gridColumn={'1/-1'}
          isLoading
          loadingText="Claiming"
        >
          Claim
        </NetworkButton>
      ) : (
        <NetworkButton
          w="full"
          size={'xs'}
          variant="solid3"
          gridColumn={'1/-1'}
          onClick={() => write()}
        >
          Claim
        </NetworkButton>
      )}

      {/* <NetworkButton w="full" size={'xs'} variant="solid3" gridColumn={'1/-1'}>
        Pay fees
      </NetworkButton> */}
    </Grid>
  )
}
