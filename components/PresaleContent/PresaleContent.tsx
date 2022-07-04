import {
  Text,
  Heading,
  Spinner,
  Button,
  Image,
  Tooltip,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import Countdown, {
  CountdownRendererFn,
  CountdownRenderProps,
} from 'react-countdown'
import { connectorIcons, presaleContractConfig } from '../../config/constants'
import { SolarContext } from '../../context/SolarContext'
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
  const { Presale } = useContext(SolarContext)

  useEffect(() => {
    if (!Presale.startsAt) return
    setStarted(Presale.startsAt * 1000 < Date.now())
  }, [Presale.startsAt])

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
      {!mounted || Presale.loading ? (
        <Spinner color="white" />
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
                top={{ base: 2, lg: 8 }}
                left={{ base: 2, lg: 8 }}
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
              top={{ base: 2, lg: 8 }}
              left={{ base: 2, lg: 8 }}
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
          {Presale.whitelistId !== 0 ? (
            <Text
              position={'absolute'}
              top={{ base: 2, lg: 8 }}
              right={{ base: 2, lg: 8 }}
            >
              Whitelisted {Presale.whitelistId === 1 && '☀'}
              {Presale.whitelistId === 2 && '🐻'}
            </Text>
          ) : (
            <Text
              position={'absolute'}
              top={{ base: 2, lg: 8 }}
              right={{ base: 2, lg: 8 }}
            >
              ❌ Not Whitelisted
            </Text>
          )}
          {started ? (
            <>
              <PresaleStats />
              <WalletStats />
              {/* {Presale.whitelistId !== undefined && (
                <Invest
                  whitelistId={Presale.whitelistId}
                  isWhitelisted={Boolean(
                    Presale.whitelistId !== undefined ||
                      Presale.whitelistId !== 0
                  )}
                />
              )} */}
            </>
          ) : (
            <>
              {Presale.startsAt && (
                <Countdown date={Presale.startsAt * 1000} renderer={renderer} />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
