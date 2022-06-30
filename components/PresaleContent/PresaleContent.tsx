import { Grid, Text, Heading, Spinner } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useState } from 'react'
import Countdown, {
  CountdownRendererFn,
  CountdownRenderProps,
} from 'react-countdown'
import { useAccount, useContractRead } from 'wagmi'
import { palette, presaleContractConfig } from '../../config/constants'
import useMounted from '../../hooks/useMounted'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import PresaleStats from './PresaleStats'

export default function PresaleContent() {
  const [started, setStarted] = useState(false)
  const { addLeadingZeroes } = useWeb3Formatter()
  const renderer: CountdownRendererFn = ({
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
        <>
          <Heading>Presale starts in: </Heading>
          <Text fontSize="4xl">
            {addLeadingZeroes(hours, 2)}:{addLeadingZeroes(minutes, 2)}:
            {addLeadingZeroes(seconds, 2)}
          </Text>
        </>
      )
    }
  }
  // WEB3
  // Address
  const { data: accData } = useAccount()
  // isWhitelisted
  const {
    data: isWhitelisted,
    isError: isWhitelistedErr,
    isLoading: isWhitelistedLoad,
  } = useContractRead(presaleContractConfig, 'isWhitelisted', {
    args: accData ? accData.address : ethers.constants.AddressZero,
    chainId: 250,
    onError(err) {
      console.log('Error on isWhitelisted', err)
    },
  })
  // startsAt
  const [startsAt, setStartsAt] = useState<number>(0)
  const { isError: startsAtErr, isLoading: startsAtLoad } = useContractRead(
    presaleContractConfig,
    'getStartsAt',
    {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('Error on startsAt', error)
        console.log('startsAt', Number(data))
        setStartsAt(Number(data))
        setStarted(Number(data) < Date.now()) // TODO: UNCOMENT THIS AND REMOVE TEST STATEMENT
        // setStarted(true)
      },
    }
  )

  const mounted = useMounted()

  return (
    <>
      {!mounted ? (
        <Spinner />
      ) : (
        <>
          <Countdown date={startsAt} renderer={renderer} />
          {started ? (
            <>
              {isWhitelistedErr ? (
                <Text position={'absolute'} top={8} right={8}>
                  Error
                </Text>
              ) : isWhitelistedLoad ? (
                <Spinner />
              ) : isWhitelisted ? (
                <Text position={'absolute'} top={8} right={8}>
                  yes
                </Text>
              ) : (
                <Text position={'absolute'} top={8} right={8}>
                  no
                </Text>
              )}

              <PresaleStats />
              <Text fontSize={'4xl'}>
                Wallet{' '}
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
                justifyItems={'center'}
              >
                <Text justifySelf={'start'}>Max. allocation: 30 $pKELVIN</Text>
                <Text justifySelf={'center'}>Tokens purchased: 5 $pKELVIN</Text>
                <Text justifySelf={'end'}>Available: 25 $pKELVIN</Text>
              </Grid>
            </>
          ) : (
            <>
              {startsAtErr ? (
                <Text>There was an error fetching the Start timestamp</Text>
              ) : startsAtLoad ? (
                <>
                  {' '}
                  <Spinner size={'lg'} />
                </>
              ) : (
                <>
                  {startsAt !== 0 && (
                    <Countdown date={startsAt} renderer={renderer} />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
