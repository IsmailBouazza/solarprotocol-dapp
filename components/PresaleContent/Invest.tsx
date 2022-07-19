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
import { useCallback, useContext, useEffect, useState } from 'react'
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
import { SolarContext } from '../../context/SolarContext'
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
  const { address } = useAccount()
  const { Presale } = useContext(SolarContext)
  //  setIsApproved(Number(data) > 600 * 10 ** 6)

  // toInvest
  const [toInvest, setToInvest] = useState(0)
  // invest
  const {
    isError: toInvestErr,
    isLoading: toInvestLoad,
    write: invest,
  } = useContractWrite({
    ...presaleContractConfig,
    functionName: 'invest',
    args: [
      Presale.currentEpoch
        ? ethers.utils.parseUnits(
            (toInvest * Presale.currentEpoch.price).toString(),
            6
          )
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
      summonToast('investErr', 'error', <>{error.name} on invest</>)
    },
  })
  // approve
  const {
    isError: approveErr,
    isLoading: approveLoad,
    write: approve,
  } = useContractWrite({
    addressOrName: USDCAddress,
    contractInterface: erc20ABI,
    functionName: 'approve',
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
  })

  const [balance, setBalance] = useState<number>(0)
  const { data, isError, isLoading } = useBalance({
    addressOrName: address ? address : ethers.constants.AddressZero,
    token: USDCAddress,
    watch: true,
    chainId: 250,
    cacheTime: 5_000,
    staleTime: 5_000,
    onSuccess(data) {
      setBalance(Number(ethers.utils.formatUnits(data.value, 6)))
    },
  })

  const investWrapper = useCallback(() => {
    if (!Presale.currentEpoch) return
    if (toInvest === 0) return
    const cost = toInvest * Presale.currentEpoch.price
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
  }, [Presale.currentEpoch, balance, invest, summonToast, toInvest])

  useEffect(() => {
    investWrapper()
  }, [toInvest])

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
        1$nKELVIN = {Presale.currentEpoch && Presale.currentEpoch.price}$USDC
      </Text>

      <Grid
        gap={2}
        templateColumns={{
          base: '1fr',
          md: 'repeat(2,1fr)',
          lg: 'repeat(3,1fr)',
        }}
      >
        {Presale.currentEpoch && (
          <>
            {Presale.allowance && Presale.allowance > 600 * 10 ** 6 ? (
              <>
                {Presale.userCap !== undefined &&
                Presale.tokensIssued !== undefined ? (
                  <>
                    {Presale.userCap - Presale.tokensIssued >= 5 && (
                      <InvestButton
                        isLoading={toInvestLoad}
                        currentEpoch={Presale.currentEpoch}
                        amount={5}
                        issued={Presale.tokensIssued}
                        max={Presale.userCap}
                        invest={setToInvest}
                      />
                    )}
                    {Presale.userCap - Presale.tokensIssued >= 10 && (
                      <InvestButton
                        isLoading={toInvestLoad}
                        currentEpoch={Presale.currentEpoch}
                        amount={10}
                        issued={Presale.tokensIssued}
                        max={Presale.userCap}
                        invest={setToInvest}
                      />
                    )}
                    {Presale.userCap - Presale.tokensIssued >= 30 && (
                      <InvestButton
                        isLoading={toInvestLoad}
                        currentEpoch={Presale.currentEpoch}
                        amount={30}
                        issued={Presale.tokensIssued}
                        max={Presale.userCap}
                        invest={setToInvest}
                      />
                    )}
                  </>
                ) : (
                  <Text>Error loading wallet data</Text>
                )}

                {Presale.userCap === Presale.tokensIssued && (
                  <Text textAlign={'center'} gridColumn={'1/-1'}>
                    Allocation limit per wallet reached.
                  </Text>
                )}
              </>
            ) : (
              <VStack gridColumn={'1/-1'}>
                <Text>
                  You need to approve the Presale contract to spend your USDC.
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
        )}
      </Grid>
    </>
  )
}
