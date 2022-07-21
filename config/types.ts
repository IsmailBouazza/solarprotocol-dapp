import { ethers } from 'ethers'
import { Dispatch, SetStateAction } from 'react'

// Component Interfaces
export interface IInvestInfo {
  userCap: number
  investorIssued: number
  step: number
  epoch: IEpoch
}

export interface IStarCardProps {
  [key: number]: {
    starName: string
    video: string
  }
}

export interface IMintStarCardProps {
  selectedType: number
  setSelectedType: Dispatch<SetStateAction<number>>
  starType: IStarType
}

// State Interfaces
export interface IEpoch {
  id: number
  duration: number
  price: number
  epochUserCap: number
  userCap: number
  epochTotalCap: number
  totalCap: number
  whitelistIds: number[]
  endsAt: number
}

export interface IPresale {
  loading: boolean // Determines wether it's loaded or not
  currentEpoch?: IEpoch // Current epoch parameters
  name?: string // Presale Token Name
  symbol?: string // Presale Token Symbol
  investmentToken?: string // Investment token address
  startsAt?: number // Epoch timestamp when presale starts
  endsAt?: number // Epoch timestamp when presale ends
  userCap?: number // Max amount of tokens to be purchased by a user
  totalCap?: number // Max amount of tokens that can be issued
  minimalBalance?: number // Minimum amount of tokens to purchase
  step?: number // Step between purchase amounts
  totalInvested?: number // amount of investmentTokens deposited
  totalIssued?: number // amount of presale tokens issued
  whitelistId?: number // whitelistId
  tokensIssued?: number // amount of tokens issued to user
  allowance?: number
}

export interface IStarType {
  id: number
  name: string
  price: number
  stablePrice: number
  rewardsPerSecond: number
}

export interface IStarTypes {
  loading: boolean
  types?: IStarType[] // array of all 3 of the Star types
  protoCount?: number // global number of Proto Stars
  neutronCount?: number // global number of Neutron Stars
  quasarCount?: number // global number of Quasar Stars
  claimTax?: number // % of claim tax
}

export interface IStar {
  tokenId: number
  typeId: number
  createdAt: number
  isPresale: boolean
  pendingRewards: number
}

export interface IUserState {
  loading: boolean
  usdcBalance?: number // User's USDC balance
  kelvinBalance?: number // User's KELVIN balance
  usdcAllowance?: number // Allowance  of USDC for the diamond to spend
  kelvinAllowance?: number // Allowance of KELVIN for the diamond to spend
  stars?: IStar[] // Array with all of the user's stars
}

// Config Interfaces
export interface INetworkDetails {
  [key: number]: {
    rpcUrl: string
    chainProviders: ethers.providers.BaseProvider
    blockExplorerURL: string
    blockExplorerName: string
    prefix: string
    logoURI: string
  }
}

export interface IConnectorIcon {
  [key: string]: {
    logoURI: string
  }
}

export interface ISecondsByDuration {
  [key: string]: number
}

export interface ICostPerTier {
  [key: number]: number
}

export interface IBalancerPool {
  data: {
    pool: {
      address: string
      swapFee: string
      tokens: IToken[]
    }
  }
}

interface IToken {
  address: string
  balance: string
  weight: string
  decimals: number
  name: string
  symbol: string
}
