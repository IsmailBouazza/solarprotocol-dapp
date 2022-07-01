/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi'
import {
  palette,
  presaleContractConfig,
  USDCAddress,
} from '../../config/constants'
import { IEpoch } from '../../config/types'

export default function Invest({ isWhitelisted }: { isWhitelisted: boolean }) {
  // WEB3
  const { data: userData } = useAccount()
  // userCap
  const [userCap, setUserCap] = useState<number>(0)
  const {
    isError: userCapErr,
    isLoading: userCapLoad,
    error,
  } = useContractRead(presaleContractConfig, 'getUserCap', {
    chainId: 250,
    onSettled(data, error) {
      if (error) console.log('📈 Error on userCap', error)
      const formatted = Number(
        ethers.utils.formatEther(data as unknown as string)
      )
      console.log('📈 userCap', formatted)
      setUserCap(formatted)
    },
  })

  // investorIssued
  const [investorIssued, setInvestorIssued] = useState<number>(0)
  const { refetch: investorIssuedRefetch } = useContractRead(
    presaleContractConfig,
    'balanceOf',
    {
      chainId: 250,
      args: [userData?.address],
      onSettled(data, error) {
        if (error) console.log('📈 Error on investorIssued', error)
        const formatted = Number(
          ethers.utils.formatEther(data as unknown as string)
        )
        console.log('📈 investorIssued', formatted)
        setInvestorIssued(formatted)
      },
    }
  )

  // step
  const [step, setStep] = useState<number>(0)
  const { isError: stepErr, isLoading: stepLoad } = useContractRead(
    presaleContractConfig,
    'getStep',
    {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('📈 Error on getStep', error)
        const formatted = Number(
          ethers.utils.formatEther(data as unknown as string)
        )
        console.log('📈 getStep', formatted)
        setStep(formatted)
      },
    }
  )
  // currentEpoch
  const [currentEpoch, setCurrentEpoch] = useState<IEpoch>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildEpoch(data: any) {
    const epoch: IEpoch = {
      id: Number(data.epoch['id']),
      duration: Number(data.epoch['duration']),
      price: Number(data.epoch['price']),
      epochUserCap: Number(data.epoch['epochUserCap']),
      userCap: Number(data.epoch['userCap']),
      epochTotalCap: Number(data.epoch['epochTotalCap']),
      totalCap: Number(data.epoch['totalCap']),
      whitelistIds: data.epoch[7].map((val: ethers.BigNumberish) => {
        return Number(val)
      }),
      endsAt: Number(data.endsAt),
    }
    return epoch
  }
  const { isError: currentEpochErr, isLoading: currentEpochLoad } =
    useContractRead(presaleContractConfig, 'getCurrentEpoch', {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('📈 Error on currentEpoch', error)
        if (!data) return
        console.log('📈 currentEpoch', buildEpoch(data))
        setCurrentEpoch(buildEpoch(data))
      },
    })

  // isApproved
  const [isApproved, setIsApproved] = useState(false)
  const { refetch: isApprovedRefetch } = useContractRead(
    {
      addressOrName: USDCAddress,
      contractInterface: erc20ABI,
    },
    'allowance',
    {
      args: [
        userData ? userData.address : ethers.constants.AddressZero,
        presaleContractConfig.addressOrName,
      ],
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('📈 Error on allowance', error)
        console.log('📈 allowance', Number(data))
        setIsApproved(Number(data) > 600 * 10 ** 6)
      },
    }
  )
  // toInvest
  const [toInvest, setToInvest] = useState(5)
  // invest
  const {
    isError: toInvestErr,
    isLoading: toInvestLoad,
    write: invest,
  } = useContractWrite(presaleContractConfig, 'invest', {
    args: [
      currentEpoch
        ? ethers.utils.parseUnits((toInvest * currentEpoch.price).toString(), 6)
        : 0,
    ],
    onError(error) {
      console.log('📈 Error in invest', error)
    },
  })
  // approve
  // invest
  const {
    isError: approveErr,
    isLoading: approveLoad,
    write: approve,
  } = useContractWrite(
    {
      addressOrName: USDCAddress,
      contractInterface: erc20ABI,
    },
    'approve',
    {
      args: [presaleContractConfig.addressOrName, ethers.constants.MaxUint256],
      onError(error) {
        console.log('📈 Error in approve', error)
      },
    }
  )

  useEffect(() => {
    const interval = setInterval(() => {
      isApprovedRefetch()
      investorIssuedRefetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [investorIssuedRefetch, isApprovedRefetch])
  return (
    <>
      <Text fontSize={'4xl'}>
        <b style={{ color: palette.main.buttonLightBorder }}>Invest</b>
      </Text>
      <HStack>
        <NumberInput
          value={toInvest}
          onChange={(val, valN) => setToInvest(valN)}
          defaultValue={step}
          max={userCap - investorIssued}
          clampValueOnBlur={false}
          step={step}
          min={step}
          color="white"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        {isApproved ? (
          isWhitelisted ? (
            <Button onClick={() => invest()}>Invest</Button>
          ) : (
            <Button disabled onClick={() => invest()}>
              Invest
            </Button>
          )
        ) : isWhitelisted ? (
          <Button onClick={() => approve()}>Approve</Button>
        ) : (
          <Button disabled onClick={() => invest()}>
            Approve
          </Button>
        )}
      </HStack>
    </>
  )
}
