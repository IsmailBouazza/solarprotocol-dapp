import { HStack, Image, Spinner, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { Dispatch, SetStateAction } from 'react'
import { useBalance } from 'wagmi'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'

interface TokenTrackerProps {
  address: string
  token?: string
  watch: boolean
  chainId: number
  cacheTime: number
  staleTime: number
  tokenLogo: string
  state?: Dispatch<SetStateAction<ethers.BigNumberish>>
}
export default function TokenTracker({
  address,
  token,
  watch,
  chainId,
  cacheTime,
  staleTime,
  tokenLogo,
  state,
}: TokenTrackerProps) {
  const { data, isLoading } = useBalance({
    addressOrName: address,
    token,
    watch,
    chainId,
    cacheTime,
    staleTime,
    onSuccess(data) {
      if (!state) return
      if (!data) return
      state(data.value)
    },
  })
  const { balanceToNumber, toFormattedValue } = useWeb3Formatter()
  if (isLoading) return <Spinner size="sm" />
  return (
    <HStack>
      <Image
        src={tokenLogo}
        h="24px"
        objectFit="contain"
        alt={`token ${address} balance`}
      />
      <Text>
        {data &&
          toFormattedValue(
            balanceToNumber(Number(data?.value), data?.decimals)
          )}
      </Text>
    </HStack>
  )
}
