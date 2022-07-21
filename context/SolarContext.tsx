import { ethers } from 'ethers'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { erc20ABI, useAccount, useContractInfiniteReads } from 'wagmi'
import {
  diamondContractConfig,
  presaleContractConfig,
  USDCAddress,
} from '../config/constants'
import {
  IEpoch,
  IPresale,
  IStar,
  IStarType,
  IStarTypes,
  IUserState,
} from '../config/types'

const emptyPresale: IPresale = {
  loading: true,
}
const emptyTypes: IStarTypes = {
  loading: true,
}

const emptyUser: IUserState = {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStar(data: any, rewards: any) {
  if (!data) return
  const star: IStar = {
    createdAt: Number(data.createdAt),
    isPresale: data.isPresale,
    tokenId: Number(data.tokenId),
    typeId: Number(data.typeId),
    pendingRewards: rewards ? Number(rewards.pendingRewards) : 0,
  }
  return star
}

export const SolarContext = createContext<{
  Presale: IPresale
  StarTypes: IStarTypes
  UserState: IUserState
}>({
  Presale: emptyPresale,
  StarTypes: emptyTypes,
  UserState: emptyUser,
})

export function SolarProvider({ children }: { children: ReactNode }) {
  const [presale, setPresale] = useState<IPresale>(emptyPresale)
  const [starTypes, setStarTypes] = useState<IStarTypes>(emptyTypes)
  const [userState, setUserState] = useState<IUserState>(emptyUser)

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

  // getStarTypes
  const { refetch: refetchStars } = useContractInfiniteReads({
    cacheKey: 'typeData',
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
        ...diamondContractConfig,
        functionName: 'getTotalNodesOfType',
        args: [1],
      },
      {
        ...diamondContractConfig,
        functionName: 'getTotalNodesOfType',
        args: [2],
      },
      {
        ...diamondContractConfig,
        functionName: 'getTotalNodesOfType',
        args: [3],
      },
      {
        ...diamondContractConfig,
        functionName: 'getClaimTax',
      },
    ],
    onSettled(data, error) {
      if (error) {
        console.error('⚙ BACKEND ERROR => getStarTypes')
        return
      }
      if (!data) return
      try {
        const starTypes: IStarType[] = []
        data.pages[0][0].map((val: IStarType, idx: number) => {
          const starType = buildStarType(val, data.pages[0][idx + 1])
          if (!starType) return
          starTypes.push(starType)
        })
        setStarTypes({
          loading: false,
          types: starTypes,
          protoCount: Number(data.pages[0][4]),
          neutronCount: Number(data.pages[0][5]),
          quasarCount: Number(data.pages[0][6]),
          claimTax: Number(data.pages[0][7]),
        })
      } catch {
        console.error('⚙ BACKEND ERROR => getStarTypes')
      }
    },
    cacheTime: 5_000,
    staleTime: 5_000,
  })

  // getUserData
  const { refetch: refetchUserData } = useContractInfiniteReads({
    cacheKey: 'userData',
    contracts: () => [
      {
        ...diamondContractConfig,
        functionName: 'balanceOf(address)',
        args: [address ? address : ethers.constants.AddressZero],
      },
      {
        addressOrName: USDCAddress,
        contractInterface: erc20ABI,
        functionName: 'balanceOf',
        args: [address ? address : ethers.constants.AddressZero],
      },
      {
        ...diamondContractConfig,
        functionName: 'allowance',
        args: [
          address ? address : ethers.constants.AddressZero,
          diamondContractConfig.addressOrName,
        ],
      },
      {
        addressOrName: USDCAddress,
        contractInterface: erc20ABI,
        functionName: 'allowance',
        args: [
          address ? address : ethers.constants.AddressZero,
          diamondContractConfig.addressOrName,
        ],
      },
      {
        ...diamondContractConfig,
        functionName: 'getNodesOwnedBy(address)',
        args: [address ? address : ethers.constants.AddressZero],
      },
      {
        ...diamondContractConfig,
        functionName: 'getNodeRewardsInfo(uint256[])',
        args: [
          userState.stars?.map((val) => {
            return val.tokenId
          }),
        ],
      },
    ],
    onSettled(data, error) {
      if (error) {
        console.error('⚙ BACKEND ERROR => getUserData')
        return
      }
      if (!data) return
      try {
        console.log('👤 data: ', data)
        const stateObj: IUserState = {
          loading: false,
          kelvinBalance: format(data.pages[0][0], 18),
          usdcBalance: format(data.pages[0][1], 6),
          kelvinAllowance: format(data.pages[0][2], 18),
          usdcAllowance: format(data.pages[0][3], 6),
          stars: data.pages[0][4].map((val: IStar, idx: number) => {
            return buildStar(
              val,
              data.pages[0][5] ? data.pages[0][5][idx] : undefined
            )
          }),
        }

        console.log('👤 USER OBJ: ', stateObj)
        setUserState(stateObj)
      } catch (err) {
        console.error('⚙ BACKEND ERROR => getUserData', err)
      }
    },
    cacheTime: 5_000,
    staleTime: 5_000,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
      refetchStars()
      refetchUserData()
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
    <SolarContext.Provider
      value={{ Presale: presale, StarTypes: starTypes, UserState: userState }}
    >
      {children}
    </SolarContext.Provider>
  )
}
