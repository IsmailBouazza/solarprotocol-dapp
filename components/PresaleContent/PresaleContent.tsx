import {
  Text,
  Heading,
  Spinner,
  Button,
  Image,
  Tooltip,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useState } from 'react'
import Countdown, {
  CountdownRendererFn,
  CountdownRenderProps,
} from 'react-countdown'
import { useAccount, useContractRead } from 'wagmi'
import { connectorIcons, presaleContractConfig } from '../../config/constants'
import useMounted from '../../hooks/useMounted'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import Invest from './Invest'
import PresaleStats from './PresaleStats'
import WalletStats from './WalletStats'

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

  // whitelistId
  const [whitelistId, setWhitelistId] = useState(0)
  const {} = useContractRead(presaleContractConfig, 'getAccountWhitelist', {
    args: [accData ? accData.address : ethers.constants.AddressZero],
    chainId: 250,
    onSettled(data, err) {
      if (err) console.log('Error on whitelistId', err)
      if (!data) return
      setWhitelistId(Number(data))
    },
  })

  // isWhitelistedInPresale
  const [isWhitelistedInPresale, setIsWhitelistedInPresale] = useState(false)
  const {} = useContractRead(
    presaleContractConfig,
    'isWhitelistedIn(address,uint256[])',
    {
      args: [accData ? accData.address : ethers.constants.AddressZero, [1]],
      chainId: 250,
      onSettled(data, err) {
        if (err) console.log('Error on isWhitelistedInPresale', err)
        console.log('☀ isWhitelistedInPresale', data)
        setIsWhitelistedInPresale(Boolean(data))
      },
    }
  )

  // isWhitelistedInNB
  const [isWhitelistedInNB, setIsWhitelistedInNB] = useState(false)
  const {} = useContractRead(
    presaleContractConfig,
    'isWhitelistedIn(address,uint256[])',
    {
      args: [accData ? accData.address : ethers.constants.AddressZero, [2]],
      chainId: 250,
      onSettled(data, err) {
        if (err) console.log('Error on isWhitelistedInNB', err)
        console.log('🐻 isWhitelistedInNB', data)
        setIsWhitelistedInNB(Boolean(data))
      },
    }
  )
  // startsAt
  const [startsAt, setStartsAt] = useState<number>(0)
  const { isError: startsAtErr, isLoading: startsAtLoad } = useContractRead(
    presaleContractConfig,
    'getStartsAt',
    {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('📅 Error on startsAt', error)
        console.log('📅 startsAt', Number(data))
        setStartsAt(Number(data))
        setStarted(Number(data) * 1000 < Date.now()) // TODO: UNCOMENT THIS AND REMOVE TEST STATEMENT
        // setStarted(true) // TEST STATEMENT
      },
    }
  )

  const mounted = useMounted()

  async function addToken(address: string, symbol: string) {
    if (typeof window === undefined) return
    const ethereum = window.ethereum
    if (!ethereum) return
    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: address,
          symbol: symbol,
          decimals: 18,
        },
      },
    })
  }

  return (
    <>
      {!mounted ? (
        <Spinner />
      ) : (
        <>
          {window.ethereum ? (
            <Tooltip
              hasArrow
              aria-label="Add $nKELVIN to Metamask"
              label="Add $nKELVIN to Metamask"
            >
              <Button
                position={'absolute'}
                p={4}
                py={6}
                top={8}
                left={8}
                onClick={() =>
                  addToken(presaleContractConfig.addressOrName, 'nKELVIN')
                }
              >
                <Image
                  src={connectorIcons['MetaMask'].logoURI}
                  alt="MetaMask logo"
                  minH="32px"
                />
                +
              </Button>
            </Tooltip>
          ) : (
            <Button
              disabled
              position={'absolute'}
              p={4}
              py={6}
              top={8}
              left={8}
              onClick={() =>
                addToken(presaleContractConfig.addressOrName, 'nKELVIN')
              }
            >
              <Image
                src={connectorIcons['MetaMask'].logoURI}
                alt="MetaMask logo"
                minH="32px"
              />
              +
            </Button>
          )}
          {isWhitelistedErr ? (
            <Text position={'absolute'} top={8} right={8}>
              Error
            </Text>
          ) : isWhitelistedLoad ? (
            <Spinner />
          ) : isWhitelisted ? (
            <Text position={'absolute'} top={8} right={8}>
              Whitelisted {isWhitelistedInPresale && '☀'}
              {isWhitelistedInNB && '🐻'}
            </Text>
          ) : (
            <Text position={'absolute'} top={8} right={8}>
              ❌ Not Whitelisted
            </Text>
          )}
          {started ? (
            <>
              <PresaleStats />
              <WalletStats />
              <Invest
                whitelistId={whitelistId}
                isWhitelisted={Boolean(isWhitelisted)}
              />
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
                    <Countdown date={startsAt * 1000} renderer={renderer} />
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
