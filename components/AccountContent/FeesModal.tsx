import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  VStack,
  Grid,
  RadioGroup,
  Radio,
  HStack,
  Spinner,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import moment from 'moment'
import React, { useContext, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { erc20ABI, useContractRead, useContractWrite } from 'wagmi'
import {
  diamondContractConfig,
  palette,
  USDCAddress,
} from '../../config/constants'
import { IStar } from '../../config/types'
import { SolarContext } from '../../context/SolarContext'
import NetworkButton from '../NetworkButton'

function ModalFee({
  isOpen,
  onClose,
  star,
}: {
  isOpen: boolean
  onClose: () => void
  star: IStar | undefined
}) {
  const [days, setDays] = useState(30)

  const [cost, setCost] = useState<number | undefined>()
  const { isLoading: feesLoading } = useContractRead({
    ...diamondContractConfig,
    functionName: 'calculateFeeAmount',
    args: [star === undefined ? 0 : star.typeId, days],
    onSuccess(data) {
      setCost(Number(ethers.utils.formatUnits(data, 6)))
    },
  })
  const { isLoading, write } = useContractWrite({
    ...diamondContractConfig,
    functionName: 'payFee',
    args: [star === undefined ? 0 : star.tokenId, days],
    onSettled(data, error) {
      if (error) {
        console.error(
          `⭐ #${star === undefined ? 0 : star.tokenId} error: `,
          error.name
        )
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
        pending: `🏦 Paying fees for Star ${
          star === undefined ? 0 : star.tokenId
        }.`,
        success: `🤑 Payed fees for Star ${
          star === undefined ? 0 : star.tokenId
        }.`,
        error: '🔥 Paying fees failed.',
      })
    },
  })
  const { isLoading: isLoadingApprove, write: writeApprove } = useContractWrite(
    {
      addressOrName: USDCAddress,
      contractInterface: erc20ABI,
      functionName: 'approve',
      args: [diamondContractConfig.addressOrName, ethers.constants.MaxUint256],
      onSettled(data, error) {
        if (error) {
          console.error(`🔐 USDC error: `, error.name)
          toast.error(`Approve USDC:  ${error.name}`, {
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
          pending: '🔒🔑 Approving USDC.',
          success: '🔓 USDC Approved.',
          error: '🔒❌ USDC Approval failed.',
        })
      },
    }
  )

  const daysPaidFor = useMemo(() => {
    if (!star) return -1
    if (star.fees.expiresAt === 0) return -1
    const start = moment()
    const end = moment(star.fees.expiresAt * 1000)
    return end.diff(start, 'days')
  }, [star])

  const { UserState } = useContext(SolarContext)
  return (
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
          Maintenance fees for Star#{star === undefined ? 0 : star.tokenId}
        </ModalHeader>
        <ModalCloseButton color={'white'} />
        <ModalBody px={4} color="white">
          <VStack w="full">
            <Text alignSelf="start" fontSize={'lg'}>
              Pay Fees for:
            </Text>

            {daysPaidFor === -1 ? (
              <Spinner size="md" color="white" />
            ) : (
              <>
                <RadioGroup
                  onChange={(item) => setDays(Number(item))}
                  value={days}
                  colorScheme="orange"
                  py={4}
                >
                  <Grid
                    templateColumns="repeat(5,1fr)"
                    w="full"
                    justifyItems={'center'}
                    alignItems="center"
                    gap={4}
                  >
                    {180 - daysPaidFor < 30 ? (
                      <Radio value={30} isDisabled />
                    ) : (
                      <Radio value={30} />
                    )}
                    {180 - daysPaidFor < 60 ? (
                      <Radio value={60} isDisabled />
                    ) : (
                      <Radio value={60} />
                    )}
                    {180 - daysPaidFor < 90 ? (
                      <Radio value={90} isDisabled />
                    ) : (
                      <Radio value={90} />
                    )}
                    {180 - daysPaidFor < 120 ? (
                      <Radio value={120} isDisabled />
                    ) : (
                      <Radio value={120} />
                    )}
                    {180 - daysPaidFor < 150 ? (
                      <Radio value={150} isDisabled />
                    ) : (
                      <Radio value={150} />
                    )}
                    <Text>30 days</Text>
                    <Text>60 days</Text>
                    <Text>90 days</Text>
                    <Text>120 days</Text>
                    <Text>150 days</Text>
                  </Grid>
                </RadioGroup>
                <HStack w="full">
                  <Text>Total Cost: </Text>
                  {feesLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <Text>{cost} $USDC</Text>
                  )}
                </HStack>
              </>
            )}
            {UserState.usdcAllowance &&
            UserState.usdcAllowance >= (cost ?? 90) ? (
              <>
                {isLoading ? (
                  <NetworkButton
                    alignSelf={'end'}
                    variant={'solid3'}
                    isLoading
                    loadingText="Paying fees..."
                  >
                    Pay fees
                  </NetworkButton>
                ) : (
                  <NetworkButton
                    variant={'solid3'}
                    onClick={() => write()}
                    alignSelf={'end'}
                  >
                    Pay fees
                  </NetworkButton>
                )}
              </>
            ) : (
              <>
                {isLoadingApprove ? (
                  <NetworkButton
                    alignSelf={'end'}
                    variant={'solid3'}
                    isLoading
                    loadingText="Approving..."
                  >
                    Approve
                  </NetworkButton>
                ) : (
                  <NetworkButton
                    variant={'solid3'}
                    onClick={() => writeApprove()}
                    alignSelf={'end'}
                  >
                    Approve
                  </NetworkButton>
                )}
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const FeesModal = React.memo(ModalFee)

FeesModal.displayName = `FeesModal`
export default FeesModal
