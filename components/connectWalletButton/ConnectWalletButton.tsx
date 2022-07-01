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
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import useMounted from '../../hooks/useMounted'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import useToastHelper from '../../hooks/useToastHelper'
import TokenTracker from '../tokenTracker'
import ConnectWalletButtonIcons from './ConnectWalletButtonIcons'
import { palette } from '../../config/constants'

export default function ConnectWalletButton() {
  const mounted = useMounted()
  const { connect, connectors, error, isError, isConnecting, isConnected } =
    useConnect({
      onConnect() {
        onClose()
        summonToast('connected', 'info', <Text>Wallet connected</Text>)
      },
    })
  const { disconnect } = useDisconnect({
    onSuccess() {
      summonToast('disconnected', 'warning', <Text>Wallet disconnected</Text>)
    },
  })
  const { data } = useAccount()
  const { activeChain, switchNetwork, isLoading } = useNetwork()

  const { trimmedAddress } = useWeb3Formatter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasCopied, onCopy } = useClipboard(
    data && data.address ? data.address : '',
    {
      timeout: 1000,
    }
  )
  const { summonToast } = useToastHelper()

  // Show toast on error
  useEffect(() => {
    if (!isError) return
    if (error) summonToast('error', 'error', <Text>{error.message}</Text>)
  }, [error, isError, onClose, summonToast])

  // Show toast on copy
  useEffect(() => {
    if (!hasCopied) return
    summonToast('copy', 'info', <Text>Address copied</Text>)
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
        {isConnected ? 'Wallet' : 'Connect'}
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
              <Text>Connected with {data?.connector?.name}</Text>
            ) : (
              <Text>Connect Wallet</Text>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={4} color="white">
            {isConnected ? (
              <VStack py={2} alignItems="start">
                <HStack w="100%" justifyContent="space-between">
                  <HStack cursor="pointer" onClick={() => onCopy()}>
                    <BiWallet />
                    <Text>
                      {data && data.address && trimmedAddress(data.address)}
                    </Text>
                  </HStack>
                  <IconButton
                    variant="ghost"
                    aria-label="disconnect"
                    icon={<VscDebugDisconnect />}
                    onClick={() => disconnect()}
                  />
                </HStack>
                <HStack w="100%" justifyContent="space-between">
                  {activeChain?.id === 250 && data?.address ? (
                    <>
                      <HStack>
                        <TokenTracker
                          tokenLogo="https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016"
                          address={data.address}
                          watch={true}
                          cacheTime={5000}
                          chainId={250}
                          staleTime={5000}
                        />
                      </HStack>
                      {/* <TokenTracker
                        tokenLogo="https://assets.coingecko.com/coins/images/19158/small/beets-icon-large.png?1634545465"
                        address={data.address}
                        token="0xF24Bcf4d1e507740041C9cFd2DddB29585aDCe1e"
                        watch={true}
                        cacheTime={5000}
                        chainId={250}
                        staleTime={5000}
                      /> */}
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
                        onClick={() => connect(connector)}
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
