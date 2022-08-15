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
import { ethers } from 'ethers'
import { StaticImageData } from 'next/image'
import NetworkButton from '../NetworkButton'
import { useContractWrite } from 'wagmi'
import { toast } from 'react-toastify'
function ModalCompound({
  isOpen,
  onClose,
  price,
}: {
  isOpen: boolean
  onClose: () => void
  price: number
}) {
  const imgs: { [key: number]: StaticImageData } = {
    1: proton,
    2: neutron,
    3: quasar,
    4: quasar,
  }
  const [getIdTypes, setIdTypes] = useState<number>(1)
  /*   const [compoundReward, setCompoundReward] = useState<number>(0)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { StarTypes, UserState } = useContext(SolarContext)
  const { balanceToNumber } = useWeb3Formatter()
  const [selectedType, setSelectedType] = useState(0)
  const pendingRewards = useMemo(() => {
    let pending = 0
    if (!UserState.stars) return pending
    UserState.stars.map((val) => {
      pending += val.pendingRewards
    })
    return Number(ethers.utils.formatEther(pending))
  }, [UserState.stars])

  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'compoundNodeRewards(typeId)',
    args: [selectedType],
    onSettled(data, error) {
      if (error) {
        console.error(`⭐ #${selectedType} error: `, error.name)
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
        pending: `🏦 Compounding a Star of type ${selectedType}.`,
        success: `🤑 Compounding a Star of type ${selectedType}.`,
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
          You have {pendingRewards.toFixed(2)}
          $KELVIN available select which star to create{' '}
          <Grid pb={4} gap={4} templateColumns={'repeat(4,1fr)'}>
            {StarTypes.types?.map((val) => {
              return (
                <VStack key={val.id}>
                  <RadioGroup
                    onChange={(item) => setIdTypes(Number(item))}
                    value={getIdTypes}
                    colorScheme="orange"
                    py={4}
                  >
                    <VStack>
                      <Image
                        maxH={'50px'}
                        src={imgs[val.id].src}
                        alt=""
                      ></Image>
                      <Radio
                        onClick={() => setSelectedType(val.id - 1)}
                        value={val.id}
                        disabled={
                          StarTypes.types
                            ? pendingRewards < StarTypes.types[val.id - 1].price
                            : true
                        }
                      />
                    </VStack>
                  </RadioGroup>
                  <VStack whiteSpace={'nowrap'}>
                    <Text>{val.name}</Text>
                    <Text> {balanceToNumber(val.price, 18)}$KELVIN</Text>
                  </VStack>
                </VStack>
              )
            })}
          </Grid>
          <HStack pb={4} justifyContent={'space-between'}>
            <Flex>
              You are saving&nbsp;
              {StarTypes.claimTax && StarTypes.types ? (
                <Text>
                  {(
                    ((pendingRewards * StarTypes.claimTax) / 100) * price +
                    balanceToNumber(
                      StarTypes.types[selectedType].stablePrice,
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
              <NetworkButton
                disabled={
                  StarTypes.types
                    ? pendingRewards < StarTypes.types[selectedType].price
                    : true
                }
                variant={'solid2'}
                onClick={() => write()}
              >
                Compound
              </NetworkButton>
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
