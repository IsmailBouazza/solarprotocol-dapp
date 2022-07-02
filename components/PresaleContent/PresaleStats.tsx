import {
  Divider,
  Grid,
  Heading,
  HStack,
  Progress,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Countdown, {
  CountdownRendererFn,
  CountdownRenderProps,
} from 'react-countdown'
import { useContractRead } from 'wagmi'
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
  // endsAt
  const [endsAt, setEndsAt] = useState<number>(0)
  const { isError: endsAtErr, isLoading: endsAtLoad } = useContractRead(
    presaleContractConfig,
    'getEndsAt',
    {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('📅 Error on endsAt', error)
        console.log('📅 endsAt', Number(data))
        setEndsAt(Number(data))
        console.log('📅 ended condition', Number(data) < Date.now())
        setEnded(Number(data) > Date.now()) // TODO: UNCOMENT THIS AND REMOVE TEST STATEMENT
        // setEnded(false)
      },
    }
  )
  // currentEpoch
  const [currentEpoch, setCurrentEpoch] = useState<IEpoch>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildEpoch(data: any) {
    const epoch: IEpoch = {
      id: Number(data.epoch['id']),
      duration: Number(data.epoch['duration']),
      price: Number(data.epoch['price']),
      epochUserCap: Number(data.epoch['epochUserCap']),
      userCap: Number(data.epoch['userCap']),
      epochTotalCap: Number(data.epoch['epochTotalCap']),
      totalCap: Number(data.epoch['totalCap']),
      whitelistIds: data.epoch[7].map((val: ethers.BigNumberish) => {
        return Number(val)
      }),
      endsAt: Number(data.endsAt),
    }
    return epoch
  }
  const { isError: currentEpochErr, isLoading: currentEpochLoad } =
    useContractRead(presaleContractConfig, 'getCurrentEpoch', {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('📅 Error on currentEpoch', error)
        if (!data) return
        console.log('📅 currentEpoch', buildEpoch(data))
        setCurrentEpoch(buildEpoch(data))
        // setEndsAt(Number(data))
        // setEnded(Number(data) < Date.now()) // TODO: UNCOMENT THIS AND REMOVE TEST STATEMENT
        // // setEnded(false)
      },
    })
  // getTotalCap
  const [totalCap, setTotalCap] = useState<number>(0)
  const { isError: totalCapErr, isLoading: totalCapLoad } = useContractRead(
    presaleContractConfig,
    'getTotalCap',
    {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('📅 Error on totalCap', error)
        const formatted = Number(
          ethers.utils.formatEther(data as unknown as string)
        )
        console.log('📅 totalCap', formatted)
        setTotalCap(formatted)
      },
    }
  )
  // getTotalIssued
  const [totalIssued, settotalIssued] = useState<number>(0)
  const {
    isError: totalIssuedErr,
    isLoading: totalIssuedLoad,
    refetch: totalIssuedRefetch,
  } = useContractRead(presaleContractConfig, 'getTotalIssued', {
    chainId: 250,
    onSettled(data, error) {
      if (error) console.log('📅 Error on totalIssued', error)
      if (!data) return
      const formatted = Number(
        ethers.utils.formatEther(data as unknown as string)
      )
      console.log('📅 totalIssued', formatted)
      settotalIssued(formatted)
    },
  })

  // getTotalInvested
  const [totalInvested, setTotalInvested] = useState<number>(0)
  const {
    isError: totalInvestedErr,
    isLoading: totalInvestedLoad,
    refetch: totalInvestedRefetch,
  } = useContractRead(presaleContractConfig, 'getTotalInvested', {
    chainId: 250,
    onSettled(data, error) {
      if (error) console.log('📅 Error on totalInvested', error)
      if (!data) return
      const formatted = Number(
        ethers.utils.formatUnits(data as unknown as string, 6)
      )
      console.log('📅 totalInvested', formatted)
      setTotalInvested(formatted)
    },
  })
  // Progress
  const [percent, setPercent] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      totalIssuedRefetch()
      totalInvestedRefetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [totalInvestedRefetch, totalIssuedRefetch])
  useEffect(() => {
    if (totalIssued && totalCap) setPercent((totalIssued / totalCap) * 100)
  }, [totalIssued, totalCap])
  const [ended, setEnded] = useState(true)
  return (
    <>
      {ended ? (
        <>
          <Heading>PRESALE HAS ENDED</Heading>
          <Heading>SOLAR LAUNCH IN</Heading>
          <Countdown date={1657306800000} renderer={renderer} />
        </>
      ) : (
        <>
          {currentEpochErr ? (
            <Text textAlign={'center'}>
              There was an error fetching the current epoch&apos;s data.
            </Text>
          ) : currentEpochLoad ? (
            <Spinner />
          ) : (
            <>
              {' '}
              <Text fontSize={'4xl'} textAlign={'center'}>
                Presale{' '}
                <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
              </Text>
              <Grid
                templateColumns={{
                  base: '1fr',
                  '2xl': 'repeat(3, 1fr)',
                }}
                fontSize={'xl'}
                w="full"
                justifyItems={'start'}
              >
                <Text justifySelf={{ base: 'center', '2xl': 'start' }}>
                  Phase: {currentEpoch?.id}
                </Text>
                <HStack justifySelf={'center'}>
                  <Text>Presale ends in:</Text>
                  {mounted && endsAtErr ? (
                    <>Error fetching endsAt</>
                  ) : (
                    <>
                      {endsAtLoad ? (
                        <Spinner />
                      ) : (
                        <Countdown date={endsAt * 1000} renderer={renderer} />
                      )}
                    </>
                  )}
                </HStack>
                <HStack justifySelf={{ base: 'center', '2xl': 'end' }}>
                  <Text>Next phase in:</Text>
                  {mounted && currentEpoch && (
                    <Countdown
                      date={currentEpoch.endsAt * 1000}
                      renderer={renderer}
                    />
                  )}
                </HStack>
              </Grid>
            </>
          )}
          <Divider borderBottomWidth={'2px'} opacity={1} />
          <Grid
            templateColumns={{
              base: '1fr',
              lg: 'repeat(2, 1fr)',
            }}
            fontSize={'xl'}
            w="full"
            justifyItems={'center'}
          >
            <Text justifySelf={{ base: 'center', '2xl': 'start' }}>
              Tokens Sold{' '}
              {totalIssuedErr ? (
                <>Error fetching totalIssued</>
              ) : (
                <>
                  {totalIssuedLoad ? (
                    <Spinner />
                  ) : (
                    totalIssued.toLocaleString('en-GB')
                  )}
                </>
              )}
              /
              {totalCapErr ? (
                <>Error fetching totalCap</>
              ) : (
                <>
                  {totalCapLoad ? (
                    <Spinner />
                  ) : (
                    totalCap.toLocaleString('en-GB')
                  )}
                </>
              )}
            </Text>
            {totalInvestedErr ? (
              <Text justifySelf={{ base: 'center', '2xl': 'end' }}>
                There was an error fetching totalInvested
              </Text>
            ) : totalInvestedLoad ? (
              <Spinner />
            ) : (
              <Text justifySelf={{ base: 'center', '2xl': 'end' }}>
                USDC Raised: ${totalInvested.toLocaleString('en-GB')}
              </Text>
            )}
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
      )}
    </>
  )
}
