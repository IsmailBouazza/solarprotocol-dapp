import {
  Divider,
  Grid,
  Heading,
  HStack,
  Progress,
  Text,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useState } from 'react'
import Countdown, {
  CountdownRendererFn,
  CountdownRenderProps,
} from 'react-countdown'
import { useAccount, useContractRead } from 'wagmi'
import { palette, presaleContractConfig } from '../../config/constants'
import { IEpoch } from '../../config/types'
import useMounted from '../../hooks/useMounted'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'

export default function PresaleStats() {
  const { addLeadingZeroes } = useWeb3Formatter()
  const mounted = useMounted()
  // Countdowns
  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      // Render a completed state
      return <Text>Live!</Text>
    } else {
      // Render a countdown
      return (
        <Text fontSize={'xl'}>
          {addLeadingZeroes(days, 2)}:{addLeadingZeroes(hours, 2)}:
          {addLeadingZeroes(minutes, 2)}:{addLeadingZeroes(seconds, 2)}
        </Text>
      )
    }
  }
  // WEB3
  // Address
  const { data: accData } = useAccount()
  // endsAt
  const [endsAt, setEndsAt] = useState<number>(0)
  const { isError: endsAtErr, isLoading: endsAtLoad } = useContractRead(
    presaleContractConfig,
    'getEndsAt',
    {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('Error on endsAt', error)
        console.log('endsAt', Number(data))
        setEndsAt(Number(data))
        console.log('ended condition', Number(data) < Date.now())
        setEnded(Number(data) < Date.now()) // TODO: UNCOMENT THIS AND REMOVE TEST STATEMENT
        // setEnded(false)
      },
    }
  )
  // currentEpoch
  const [currentEpoch, setCurrentEpoch] = useState<IEpoch>()
  function buildEpoch(data: unknown) {
    const temp = data as IEpoch
    const epoch: IEpoch = {
      id: Number(temp['id']),
      duration: Number(temp['duration']),
      price: Number(temp['price']),
      epochUserCap: Number(temp['epochUserCap']),
      userCap: Number(temp['userCap']),
      epochTotalCap: Number(temp['epochTotalCap']),
      totalCap: Number(temp['totalCap']),
      whitelistIds: temp['whitelistIds'].map((val) => {
        return Number(val)
      }),
    }
    return epoch
  }
  const { isError: currentEpochErr, isLoading: currentEpochLoad } =
    useContractRead(presaleContractConfig, 'getCurrentEpoch', {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('Error on currentEpoch', error)
        console.log('currentEpoch', buildEpoch(data))
        setCurrentEpoch(buildEpoch(data))
        // setEndsAt(Number(data))
        // setEnded(Number(data) < Date.now()) // TODO: UNCOMENT THIS AND REMOVE TEST STATEMENT
        // // setEnded(false)
      },
    })
  // Progress
  const [percent, setPercent] = useState(50)
  const [ended, setEnded] = useState(true)
  return (
    <>
      {ended ? (
        <>
          <Heading>PRESALE HAS ENDED</Heading>
          <Heading>SOLAR LAUNCH IN</Heading>
          <Countdown date={1657306800000} renderer={renderer} />
          <Grid
            templateColumns={{
              base: '1fr',
              lg: 'repeat(2, 1fr)',
            }}
            fontSize={'xl'}
            w="full"
            justifyItems={'center'}
          >
            <Text justifySelf="start">Tokens Sold 50/1500</Text>
            <Text justifySelf="end">USDC Raised: $500.00</Text>
          </Grid>
          <Progress
            value={percent}
            isAnimated
            hasStripe
            size="lg"
            w="full"
            rounded={'xl'}
            colorScheme={'purple'}
          />
        </>
      ) : (
        <>
          <Text fontSize={'4xl'}>
            Presale{' '}
            <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
          </Text>
          <Grid
            templateColumns={{
              base: '1fr',
              lg: 'repeat(2, 1fr)',
              xl: 'repeat(3, 1fr)',
            }}
            fontSize={'xl'}
            w="full"
            justifyItems={'start'}
          >
            <Text>Phase: 1</Text>
            <HStack justifySelf={'center'}>
              <Text>Presale ends in:</Text>
              {mounted && <Countdown date={endsAt} renderer={renderer} />}
            </HStack>
            <HStack justifySelf={'end'}>
              <Text>Next phase in:</Text>
              {mounted && (
                <Countdown date={1656618145000} renderer={renderer} />
              )}
            </HStack>
          </Grid>
          <Divider borderBottomWidth={'2px'} opacity={1} />
        </>
      )}
    </>
  )
}
