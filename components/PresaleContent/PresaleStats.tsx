import {
  Divider,
  Grid,
  Heading,
  HStack,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import Countdown, {
  CountdownRendererFn,
  CountdownRenderProps,
} from 'react-countdown'
import { palette } from '../../config/constants'
import { SolarContext } from '../../context/SolarContext'
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
  const { Presale } = useContext(SolarContext)

  // Progress
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    if (!Presale.endsAt) return
    setEnded(Presale.endsAt < Date.now())
  }, [Presale.endsAt])
  useEffect(() => {
    if (Presale.totalIssued && Presale.totalCap)
      setPercent((Presale.totalIssued / Presale.totalCap) * 100)
  }, [Presale.totalIssued, Presale.totalCap])
  const [ended, setEnded] = useState(true)
  return (
    <>
      {ended ? (
        <>
          <VStack style={{ marginTop: '4rem' }}>
            <Heading textAlign={'center'}>PRESALE HAS ENDED</Heading>
            <Heading textAlign={'center'}>SOLAR LAUNCH IN</Heading>
            <Countdown date={1658257200000} renderer={renderer} />
          </VStack>
        </>
      ) : (
        <>
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
              Phase: {Presale.currentEpoch?.id}
            </Text>
            <HStack justifySelf={'center'}>
              <Text>Presale ends in:</Text>
              {mounted && Presale.endsAt && (
                <Countdown date={Presale.endsAt * 1000} renderer={renderer} />
              )}
            </HStack>
            <HStack justifySelf={{ base: 'center', '2xl': 'end' }}>
              <Text>Next phase in:</Text>
              {mounted && Presale.currentEpoch && (
                <Countdown
                  date={Presale.currentEpoch.endsAt * 1000}
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
        textAlign="center"
      >
        <Text justifySelf={{ base: 'center', '2xl': 'start' }}>
          Tokens Sold{' '}
          {Presale.totalIssued && Presale.totalIssued.toLocaleString('en-GB')}/
          {Presale.totalCap && Presale.totalCap.toLocaleString('en-GB')}
        </Text>

        <Text justifySelf={{ base: 'center', '2xl': 'end' }}>
          USDC Raised: $
          {Presale.totalInvested &&
            Presale.totalInvested.toLocaleString('en-GB')}
        </Text>
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
  )
}
