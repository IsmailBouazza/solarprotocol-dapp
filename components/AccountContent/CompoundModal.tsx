import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  Grid,
  Radio,
  RadioGroup,
  Spinner,
  Image,
  HStack,
  Flex,
} from '@chakra-ui/react'
import React, { useContext, useMemo, useState } from 'react'
import { palette, diamondContractConfig } from '../../config/constants'
import { SolarContext } from '../../context/SolarContext'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import proton from '../../src/proto.png'
import quasar from '../../src/quasar.png'
import neutron from '../../src/neutron.png'
import { StaticImageData } from 'next/image'
import NetworkButton from '../NetworkButton'
import { useContractWrite } from 'wagmi'
import { toast } from 'react-toastify'

const imgs: { [key: number]: StaticImageData } = {
  1: proton,
  2: neutron,
  3: quasar,
  4: quasar,
}

function ModalCompound({
  isOpen,
  onClose,
  price,
}: {
  isOpen: boolean
  onClose: () => void
  price: number
}) {
  const [getIdTypes, setIdTypes] = useState<number>(1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { StarTypes, UserState } = useContext(SolarContext)
  const { balanceToNumber } = useWeb3Formatter()
  const pendingRewards = useMemo(() => {
    let pending = 0
    if (!UserState.stars) return pending
    UserState.stars.map((val) => {
      pending += val.pendingRewards
    })
    return balanceToNumber(pending, 18)
  }, [UserState.stars, balanceToNumber])

  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'compoundNodeRewards(uint256)',
    args: [getIdTypes],
    onSettled(data, error) {
      if (error) {
        console.error(`⭐ #${getIdTypes} error: `, error.name)
        toast.error(error.name, {
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
        pending: `🏦 Compounding a ${
          StarTypes.types ? StarTypes.types[getIdTypes - 1].name : 'loading...'
        }.`,
        success: `🤑 Compounded a ${
          StarTypes.types ? StarTypes.types[getIdTypes - 1].name : 'loading...'
        }.`,
        error: '🔥 Compounding error.',
      })
    },
  })
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="scale"
      scrollBehavior="outside"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent background={palette.background.gradient}>
        <ModalHeader justifyContent="center" py={2} px={4}>
          Compounding Stars
        </ModalHeader>
        <ModalCloseButton color={'white'} />
        <ModalBody px={4} color="white">
          {pendingRewards === 0 ? (
            <HStack>
              <Text>You have</Text>
              <Spinner size="xs" color="white" />
              <Text>$KELVIN available.</Text>
            </HStack>
          ) : (
            <Text>You have {pendingRewards.toFixed(2)}$KELVIN available.</Text>
          )}

          <Text>Select which star to create:</Text>

          <RadioGroup
            onChange={(item) => setIdTypes(Number(item))}
            value={getIdTypes}
            colorScheme="orange"
            py={4}
          >
            <Grid
              pb={4}
              gap={4}
              templateColumns={{ base: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }}
            >
              <StarRadio pendingRewards={pendingRewards} typeId={4} />
              <StarRadio pendingRewards={pendingRewards} typeId={1} />
              <StarRadio pendingRewards={pendingRewards} typeId={2} />
              <StarRadio pendingRewards={pendingRewards} typeId={3} />
            </Grid>
          </RadioGroup>
          <HStack pb={4} justifyContent={'space-between'}>
            <Flex>
              You are saving&nbsp;
              {StarTypes.claimTax && StarTypes.types ? (
                <Text>
                  {(
                    ((balanceToNumber(
                      StarTypes.types[getIdTypes - 1].price,
                      18
                    ) *
                      StarTypes.claimTax) /
                      100) *
                      price +
                    balanceToNumber(
                      StarTypes.types[getIdTypes - 1].stablePrice,
                      6
                    )
                  ).toFixed(2)}
                  $USDC
                </Text>
              ) : (
                <Spinner size="sm" color="white" />
              )}
            </Flex>
            {isLoading ? (
              <NetworkButton
                variant={'solid2'}
                isLoading
                loadingText="Compounding..."
              >
                Compound
              </NetworkButton>
            ) : (
              <>
                {StarTypes.types &&
                StarTypes.types[getIdTypes - 1] &&
                pendingRewards <
                  balanceToNumber(StarTypes.types[getIdTypes - 1].price, 18) ? (
                  <NetworkButton
                    disabled
                    variant={'solid2'}
                    onClick={() => write()}
                  >
                    Compound
                  </NetworkButton>
                ) : (
                  <NetworkButton variant={'solid2'} onClick={() => write()}>
                    Compound
                  </NetworkButton>
                )}
              </>
            )}
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
const CompoundModal = React.memo(ModalCompound)

CompoundModal.displayName = 'CompoundModal'
export default CompoundModal

function StarRadio({
  pendingRewards,
  typeId,
}: {
  typeId: number
  pendingRewards: number
}): JSX.Element {
  const { StarTypes } = useContext(SolarContext)
  const { balanceToNumber } = useWeb3Formatter()
  const Star = useMemo(() => {
    if (!StarTypes.types) return
    return StarTypes.types.filter((i) => i.id === typeId)[0]
  }, [typeId, StarTypes.types])
  return (
    <>
      {StarTypes.loading ? (
        <Spinner size={'sm'} color="white" />
      ) : (
        <>
          {Star && (
            <VStack>
              <VStack>
                <Image
                  maxH={'50px'}
                  src={imgs[typeId].src}
                  alt=""
                  opacity={
                    Star && pendingRewards < balanceToNumber(Star.price, 18)
                      ? 0.5
                      : 1
                  }
                />
                {Star && pendingRewards < balanceToNumber(Star.price, 18) ? (
                  <Radio value={typeId} disabled />
                ) : (
                  <Radio value={typeId} />
                )}
              </VStack>
              <VStack whiteSpace={'nowrap'}>
                <Text>{Star.name}</Text>
                <Text> {balanceToNumber(Star.price, 18)}$KELVIN</Text>
              </VStack>
            </VStack>
          )}
        </>
      )}
    </>
  )
}
