import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  Text,
  Spinner,
  HStack,
  useClipboard,
  IconButton,
} from '@chakra-ui/react'
import { BiWallet } from 'react-icons/bi'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi'
import useMounted from '../../hooks/useMounted'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import useToastHelper from '../../hooks/useToastHelper'
import ConnectWalletButtonIcons from './ConnectWalletButtonIcons'
import { palette } from '../../config/constants'
import TokenTracker from '../tokenTracker'

export default function ConnectWalletButton() {
  const mounted = useMounted()
  const { address, isConnected, isConnecting, connector } = useAccount()
  const { connect, connectors, error, isError, isLoading } = useConnect({
    chainId: 250,
    onSuccess(data) {
      onClose()
      summonToast(
        'connected',
        'info',
        <Text fontWeight="bold">Wallet connected {data.account}</Text>
      )
    },
  })
  const { disconnect } = useDisconnect({
    onSuccess() {
      summonToast(
        'disconnected',
        'warning',
        <Text fontWeight="bold">Wallet disconnected</Text>
      )
    },
  })

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const { trimmedAddress } = useWeb3Formatter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasCopied, onCopy } = useClipboard(address ? address : '', {
    timeout: 1000,
  })
  const { summonToast } = useToastHelper()

  // Show toast on error
  useEffect(() => {
    if (!isError) return
    if (error)
      summonToast(
        'error',
        'error',
        <Text color={'black'}>{error.message}</Text>
      )
  }, [error, isError, onClose, summonToast])

  // Show toast on copy
  useEffect(() => {
    if (!hasCopied) return
    summonToast('copy', 'info', <Text color={'black'}>Address copied</Text>)
  }, [hasCopied, summonToast])

  return (
    <>
      <Button
        className="glow"
        onClick={() => onOpen()}
        rightIcon={<BiWallet />}
        variant="solid"
        rounded="2xl"
      >
        {mounted && isConnected ? 'Wallet' : 'Connect'}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent background={palette.background.gradient}>
          <ModalHeader justifyContent="center" py={2} px={4}>
            {isConnected ? (
              <Text>Connected with {connector?.name}</Text>
            ) : (
              <Text>Connect Wallet</Text>
            )}
          </ModalHeader>
          <ModalCloseButton color={'white'} />
          <ModalBody px={4} color="white">
            {isConnected ? (
              <VStack py={2} alignItems="start">
                <HStack w="100%" justifyContent="space-between">
                  <HStack cursor="pointer" onClick={() => onCopy()}>
                    <BiWallet />
                    <Text>{address && trimmedAddress(address)}</Text>
                  </HStack>
                  <IconButton
                    variant="ghost"
                    aria-label="disconnect"
                    icon={<VscDebugDisconnect />}
                    onClick={() => disconnect()}
                  />
                </HStack>
                <HStack w="100%" justifyContent="space-between">
                  {chain?.id === 250 && address ? (
                    <>
                      <HStack>
                        <TokenTracker
                          tokenLogo="https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016"
                          address={address}
                          watch={true}
                          cacheTime={5000}
                          chainId={250}
                          staleTime={5000}
                        />
                      </HStack>
                      <TokenTracker
                        tokenLogo="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
                        address={address}
                        token="0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"
                        watch={true}
                        cacheTime={1000}
                        chainId={250}
                        staleTime={1000}
                      />
                    </>
                  ) : (
                    <>
                      {isLoading ? (
                        <Button isLoading loadingText="Switching">
                          Switch to Fantom
                        </Button>
                      ) : (
                        <Button
                          onClick={() => switchNetwork && switchNetwork(250)}
                        >
                          Switch to Fantom
                        </Button>
                      )}
                    </>
                  )}
                </HStack>
              </VStack>
            ) : (
              <VStack p={4}>
                {mounted && isConnecting ? (
                  <>
                    <Text fontWeight={'bold'}>Connecting</Text>
                    <Spinner size="xl" />
                  </>
                ) : (
                  <>
                    {connectors.map((connector) => (
                      <Button
                        w="100%"
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() =>
                          connect({ chainId: 250, connector: connector })
                        }
                        leftIcon={
                          <ConnectWalletButtonIcons
                            connector={connector.name}
                          />
                        }
                        variant="solid2"
                      >
                        <Text w="100%">{connector.name}</Text>

                        {!connector.ready && ' (unsupported)'}
                      </Button>
                    ))}
                  </>
                )}

                {/* {mounted && activeChain && (
                <div>Connected to {activeChain.name}</div>
              )}

              {mounted &&
                chains.map((x) => (
                  <Button
                    disabled={!switchNetwork || x.id === activeChain?.id}
                    key={x.id}
                    onClick={() => switchNetwork?.(x.id)}
                  >
                    {x.name}
                    {isLoading && pendingChainId === x.id && ' (switching)'}
                  </Button>
                ))} */}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <VStack></VStack>
    </>
  )
}
