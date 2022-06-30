export default function useWeb3Formatter() {
  function trimmedAddress(add: string) {
    return `${add.substring(0, 4)}...${add.substring(
      add.length - 4,
      add.length
    )}`
  }

  function balanceToNumber(balance: number, decimals: number) {
    return balance / 10 ** decimals
  }

  function toFormattedValue(number: number) {
    return `${number.toLocaleString('en-GB', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`
  }
  function toFormattedValueNoDeciamls(number: number) {
    return `${number.toLocaleString('en-GB', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })}`
  }

  function addLeadingZeroes(num: number, zeros: number) {
    return num.toLocaleString('en', {
      minimumIntegerDigits: zeros,
      useGrouping: false,
    })
  }
  return {
    trimmedAddress,
    balanceToNumber,
    toFormattedValue,
    toFormattedValueNoDeciamls,
    addLeadingZeroes,
  }
}
