import { IBalancerPool } from '../config/types'

export function calculateSpotPrice(
  pool: IBalancerPool,
  assetInSymbol: string,
  assetOutSymbol: string
) {
  debugger
  const input = pool.data.pool.tokens.filter(
    (val) => val.symbol === assetInSymbol
  )
  const output = pool.data.pool.tokens.filter(
    (val) => val.symbol === assetOutSymbol
  )
  if (!input)
    throw `Token with symbol ${assetInSymbol} not found in pool ${pool.data.pool.address}`
  if (!output)
    throw `Token with symbol ${assetOutSymbol} not found in pool ${pool.data.pool.address}`

  const inputDiv = Number(input[0].balance) / (Number(input[0].weight) * 100)
  const outputDiv = Number(output[0].balance) / (Number(output[0].weight) * 100)
  return inputDiv / outputDiv
}
