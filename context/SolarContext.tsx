import { ethers } from 'ethers'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { erc20ABI, useAccount, useContractInfiniteReads } from 'wagmi'
import {
  diamondContractConfig,
  presaleContractConfig,
  USDCAddress,
} from '../config/constants'
import { IEpoch, IPresale, IStarType, IStarTypes } from '../config/types'

const emptyPresale: IPresale = {
  loading: true,
}
const emptyTypes: IStarTypes = {
  loading: true,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildEpoch(data: any) {
  if (!data) return
  if (!data.epoch) return
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStarType(data: any, rewards: ethers.BigNumberish) {
  if (!data) return
  if (!data.length) return
  const starType: IStarType = {
    id: Number(data.id),
    name: data.name,
    price: Number(data.price),
    stablePrice: Number(data.stablePrice),
    rewardsPerSecond: Number(rewards),
  }
  return starType
}

export const SolarContext = createContext<{
  Presale: IPresale
  StarTypes: IStarTypes
}>({
  Presale: emptyPresale,
  StarTypes: emptyTypes,
})

export function SolarProvider({ children }: { children: ReactNode }) {
  const [presale, setPresale] = useState<IPresale>(emptyPresale)
  const [starTypes, setStarTypes] = useState<IStarTypes>(emptyTypes)

  const { address } = useAccount()

  const format = (n: ethers.BigNumberish, dec: number) => {
    if (!n) return
    return Number(ethers.utils.formatUnits(n, dec))
  }

  // getCurrentEpoch
  const { refetch } = useContractInfiniteReads({
    cacheKey: 'epochData',
    contracts: () => [
      { ...presaleContractConfig, functionName: 'getCurrentEpoch' },
      { ...presaleContractConfig, functionName: 'name' },
      { ...presaleContractConfig, functionName: 'symbol' },
      { ...presaleContractConfig, functionName: 'getInvestmentTokenAddress' },
      { ...presaleContractConfig, functionName: 'getStartsAt' },
      { ...presaleContractConfig, functionName: 'getEndsAt' },
      { ...presaleContractConfig, functionName: 'getUserCap' },
      { ...presaleContractConfig, functionName: 'getTotalCap' },
      { ...presaleContractConfig, functionName: 'getMinimalBalance' },
      { ...presaleContractConfig, functionName: 'getStep' },
      { ...presaleContractConfig, functionName: 'getTotalInvested' },
      { ...presaleContractConfig, functionName: 'getTotalIssued' },
      {
        ...presaleContractConfig,
        functionName: 'getAccountWhitelist',
        args: [address],
      },
      {
        ...presaleContractConfig,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        addressOrName: USDCAddress,
        contractInterface: erc20ABI,
        functionName: 'allowance',
        args: [address, presaleContractConfig.addressOrName],
      },
    ],
    onSettled(data, error) {
      if (error) {
        console.log('⚙ BACKEND ERROR => getEpoch')
        return
      }
      if (!data) return
      const presaleObj: IPresale = {
        loading: false,
        currentEpoch: buildEpoch(data?.pages[0][0]),
        name: data.pages[0][1],
        symbol: data.pages[0][2],
        investmentToken: data.pages[0][3],
        startsAt: Number(data.pages[0][4]),
        endsAt: Number(data.pages[0][5]),
        userCap: format(data.pages[0][6], 18),
        totalCap: format(data.pages[0][7], 18),
        minimalBalance: format(data.pages[0][8], 18),
        step: format(data.pages[0][9], 18),
        totalInvested: format(data.pages[0][10], 6),
        totalIssued: format(data.pages[0][11], 18),
        whitelistId: data.pages[0][12] ? Number(data.pages[0][12]) : 0,
        tokensIssued: format(data.pages[0][13], 18),
        allowance: format(data.pages[0][14], 18),
      }
      setPresale(presaleObj)
    },
    cacheTime: 5_000,
    staleTime: 5_000,
  })

  // getStarInfo
  const { refetch: refetchStars } = useContractInfiniteReads({
    cacheKey: 'starData',
    contracts: () => [
      { ...diamondContractConfig, functionName: 'getNodeTypes' },
      {
        ...diamondContractConfig,
        functionName: 'getNodeTypeRewardsPerSecond',
        args: [1],
      },
      {
        ...diamondContractConfig,
        functionName: 'getNodeTypeRewardsPerSecond',
        args: [2],
      },
      {
        ...diamondContractConfig,
        functionName: 'getNodeTypeRewardsPerSecond',
        args: [3],
      },
      {
        addressOrName: USDCAddress,
        contractInterface: erc20ABI,
        functionName: 'allowance',
        args: [address, diamondContractConfig.addressOrName],
      },
      {
        addressOrName: diamondContractConfig.addressOrName,
        contractInterface: erc20ABI,
        functionName: 'allowance',
        args: [address, diamondContractConfig.addressOrName],
      },
    ],
    onSettled(data, error) {
      if (error) {
        console.error('⚙ BACKEND ERROR => getStarInfo')
        return
      }
      if (!data) return
      console.log('⚙ starData', data)
      try {
        const starTypes: IStarType[] = []
        data.pages[0][0].map((val: IStarType, idx: number) => {
          const starType = buildStarType(val, data.pages[0][idx + 1])
          if (!starType) return
          starTypes.push(starType)
        })
        setStarTypes({ loading: false, types: starTypes })
      } catch {
        console.error('⚙ BACKEND ERROR => getStarInfo')
      }
    },
    cacheTime: 5_000,
    staleTime: 5_000,
  })
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
      refetchStars()
    }, 5_000)
    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetchStars()
  //   }, 10000)
  //   return () => clearInterval(interval)
  // }, [])

  return (
    <SolarContext.Provider value={{ Presale: presale, StarTypes: starTypes }}>
      {children}
    </SolarContext.Provider>
  )
}
