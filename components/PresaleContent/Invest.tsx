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
  VStack,
  Tooltip,
  Flex,
  Link,
  Grid,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { watch } from 'fs'
import { useCallback, useEffect, useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import {
  chainId,
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi'
import {
  palette,
  presaleContractConfig,
  USDCAddress,
} from '../../config/constants'
import { IEpoch } from '../../config/types'
import useToastHelper from '../../hooks/useToastHelper'
import InvestButton from './InvestButton'

export default function Invest({
  isWhitelisted,
  whitelistId,
}: {
  isWhitelisted: boolean
  whitelistId: number
}) {
  const { summonToast } = useToastHelper()
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
        if (!data) return
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
        if (!data) return
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
  const [toInvest, setToInvest] = useState(0)
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
    onSuccess(data) {
      summonToast(
        'invest',
        'info',
        <>
          Transaction submitted.{' '}
          <Link
            href={`https://ftmscan.com/tx/${data.hash}`}
            rel="noreferrer"
            target="_blank"
          >
            ftmscan
          </Link>
        </>
      )
    },
    onError(error) {
      summonToast('investErr', 'error', <>{error.message}</>)
    },
  })
  // approve
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
      onSuccess(data) {
        summonToast(
          'approve',
          'info',
          <>
            Transaction submitted.{' '}
            <Link
              href={`https://ftmscan.com/tx/${data.hash}`}
              rel="noreferrer"
              target="_blank"
            >
              ftmscan
            </Link>
          </>
        )
      },
      onError(error) {
        summonToast('approveErr', 'error', <>{error.message}</>)
      },
    }
  )

  const [balance, setBalance] = useState<number>(0)
  const { data, isError, isLoading } = useBalance({
    addressOrName: userData ? userData.address : ethers.constants.AddressZero,
    token: USDCAddress,
    watch: true,
    chainId: 250,
    cacheTime: 3_000,
    staleTime: 3_000,
    onSuccess(data) {
      setBalance(Number(ethers.utils.formatUnits(data.value, 6)))
    },
  })

  const investWrapper = useCallback(() => {
    debugger
    if (!currentEpoch) return
    const cost = toInvest * currentEpoch.price
    if (cost > balance) {
      summonToast(
        `tooExpensive${toInvest}`,
        'warning',
        <Text color={'black'}>
          You don{"'"}t have enough USDC, {cost} required
        </Text>
      )
      return
    }
    invest()
  }, [balance, currentEpoch, invest, summonToast, toInvest])
  useEffect(() => {
    console.log('invest n changed')
    investWrapper()
  }, [toInvest])

  useEffect(() => {
    const interval = setInterval(() => {
      isApprovedRefetch()
      investorIssuedRefetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [investorIssuedRefetch, isApprovedRefetch])
  return (
    <>
      <Tooltip
        hasArrow
        label={
          'When buying $nKELVIN, you can only use this token to redeem for a Star at a later stage. \nYou are only able to buy in increments of 5 to ensure no $nKELVIN tokens are left unusable.'
        }
        aria-label="Disclaimer"
      >
        <HStack fontSize={'2xl'} margin={0}>
          <Text
            fontSize={'4xl'}
            color={palette.main.buttonLightBorder}
            fontWeight={'bold'}
          >
            Invest
          </Text>

          <FiInfo color="white" />
        </HStack>
      </Tooltip>
      <Text fontSize={'lg'} textAlign="center">
        1$nKELVIN = {currentEpoch && currentEpoch.price}$USDC
      </Text>

      <Grid
        gap={2}
        templateColumns={{
          base: '1fr',
          md: 'repeat(2,1fr)',
          lg: 'repeat(3,1fr)',
          xl: 'repeat(4,1fr)',
          '2xl': 'repeat(6,1fr)',
        }}
      >
        {currentEpoch && (
          <>
            {whitelistId === 0 ? (
              <Text>You{"'"}re not whitelisted</Text>
            ) : (
              <>
                {currentEpoch.id === whitelistId ? (
                  <>
                    {isApproved ? (
                      <>
                        {userCap - investorIssued >= 5 && (
                          <InvestButton
                            isLoading={toInvestLoad}
                            currentEpoch={currentEpoch}
                            amount={5}
                            issued={investorIssued}
                            max={userCap}
                            invest={setToInvest}
                          />
                        )}
                        {userCap - investorIssued >= 10 && (
                          <InvestButton
                            isLoading={toInvestLoad}
                            currentEpoch={currentEpoch}
                            amount={10}
                            issued={investorIssued}
                            max={userCap}
                            invest={setToInvest}
                          />
                        )}
                        {userCap - investorIssued >= 15 && (
                          <InvestButton
                            isLoading={toInvestLoad}
                            currentEpoch={currentEpoch}
                            amount={15}
                            issued={investorIssued}
                            max={userCap}
                            invest={setToInvest}
                          />
                        )}
                        {userCap - investorIssued >= 20 && (
                          <InvestButton
                            isLoading={toInvestLoad}
                            currentEpoch={currentEpoch}
                            amount={20}
                            issued={investorIssued}
                            max={userCap}
                            invest={setToInvest}
                          />
                        )}
                        {userCap - investorIssued >= 25 && (
                          <InvestButton
                            isLoading={toInvestLoad}
                            currentEpoch={currentEpoch}
                            amount={25}
                            issued={investorIssued}
                            max={userCap}
                            invest={setToInvest}
                          />
                        )}
                        {userCap - investorIssued >= 30 && (
                          <InvestButton
                            isLoading={toInvestLoad}
                            currentEpoch={currentEpoch}
                            amount={30}
                            issued={investorIssued}
                            max={userCap}
                            invest={setToInvest}
                          />
                        )}
                        {userCap === investorIssued && (
                          <Text textAlign={'center'} gridColumn={'1/-1'}>
                            Allocation limit per wallet reached.
                          </Text>
                        )}
                      </>
                    ) : (
                      <VStack>
                        <Text>
                          You need to approve the Presale contract to spend your
                          USDC.
                        </Text>
                        {approveLoad ? (
                          <Button isLoading onClick={() => approve()}>
                            Approve
                          </Button>
                        ) : (
                          <Button onClick={() => approve()}>Approve</Button>
                        )}
                      </VStack>
                    )}
                  </>
                ) : (
                  <Text>You{"'"}re not whitelisted for this epoch.</Text>
                )}
              </>
            )}
          </>
        )}
      </Grid>
    </>
  )
}
