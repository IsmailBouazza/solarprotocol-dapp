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

export interface IInvestInfo {
  userCap: number
  investorIssued: number
  step: number
  epoch: IEpoch
}
