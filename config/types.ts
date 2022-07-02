import { ethers } from 'ethers'

// Component Interfaces
export interface IInvestInfo {
  userCap: number
  investorIssued: number
  step: number
  epoch: IEpoch
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
