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
} from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import useMounted from '../../hooks/useMounted'
import ConnectWalletButtonIcons from '../connectWalletButtonIcons'

export default function ConnectWalletButton() {
  const mounted = useMounted()
  const { connect, connectors, error } = useConnect()
  // const { activeChain, chains, isLoading, pendingChainId, switchNetwork } =
  //   useNetwork()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Connect Wallet</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack p={4}>
              {mounted &&
                connectors.map((connector) => (
                  <Button
                    w="100%"
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect(connector)}
                    leftIcon={
                      <ConnectWalletButtonIcons connector={connector.name} />
                    }
                  >
                    <Text w="100%">{connector.name}</Text>

                    {!connector.ready && ' (unsupported)'}
                  </Button>
                ))}
              {error && <div>{error.message}</div>}

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
          </ModalBody>
        </ModalContent>
      </Modal>
      <VStack></VStack>
    </>
  )
}
