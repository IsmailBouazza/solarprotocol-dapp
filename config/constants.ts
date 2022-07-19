import { ethers } from 'ethers'
import { Chain, defaultChains } from 'wagmi'
import { DiamondABI, PresaleABI } from './abis'
import {
  IConnectorIcon,
  ICostPerTier,
  INetworkDetails,
  ISecondsByDuration,
} from './types'

export const presaleContractConfig = {
  addressOrName: '0x0642d02271eBC831583F54d726D5aC9BF6709E2d',
  contractInterface: PresaleABI,
}

export const diamondContractConfig = {
  addressOrName: '0x0739a637EdC62a740E49d99e8F5f08e53CfA73cB',
  contractInterface: DiamondABI,
}

export const connectorIcons: IConnectorIcon = {
  MetaMask: {
    logoURI:
      'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  },
  'Coinbase Wallet': {
    logoURI: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4',
  },
  WalletConnect: {
    logoURI:
      'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/png/circle/walletconnect-circle-blue.png',
  },
}

export const networkDetails: INetworkDetails = {
  250: {
    rpcUrl: 'https://rpc.fantom.network	',

    chainProviders: new ethers.providers.JsonRpcProvider(
      'https://rpc.fantom.network	'
    ),

    blockExplorerURL: 'https://ftmscan.com',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
  },
  // 1: {
  //   rpcUrl: 'https://rpc.ankr.com/eth',

  //   chainProviders: new ethers.providers.JsonRpcProvider(
  //     'https://rpc.ankr.com/eth'
  //   ),

  //   blockExplorerURL: 'https://etherscan.io/',
  //   blockExplorerName: 'Etherscan',
  //   prefix: 'ethereum',
  //   logoURI:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  // },
  // 10: {
  //   rpcUrl: 'https://mainnet.optimism.io',
  //   chainProviders: new ethers.providers.JsonRpcProvider(
  //     'https://mainnet.optimism.io'
  //   ),
  //   blockExplorerURL: 'https://optimistic.etherscan.io/',
  //   blockExplorerName: 'Etherscan',
  //   prefix: 'optimism',
  //   logoURI:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
  // },
  // 56: {
  //   rpcUrl: 'https://bsc-dataseed.binance.org',
  //   chainProviders: new ethers.providers.JsonRpcProvider(
  //     'https://bsc-dataseed.binance.org'
  //   ),
  //   blockExplorerURL: 'https://www.bscscan.com/',
  //   blockExplorerName: 'BscScan',
  //   prefix: 'bsc',
  //   logoURI:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
  // },
}

export const ftmChain: Chain = {
  id: 250,
  name: 'Fantom',
  network: 'Fantom Opera',
  rpcUrls: {
    default: 'https://rpc.fantom.network	',
  },
  blockExplorers: { default: { name: 'ftmscan', url: 'https://ftmscan.com' } },
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
}

export const USDCAddress = '0x619C5e45057801361d4f99a27bbdAc75A95DDDae'
export const allChains: Chain[] = [...defaultChains, ftmChain]

export const secondsByDuration: ISecondsByDuration = {
  week: 7 * 24 * 60 * 60,
  month: 30 * 24 * 60 * 60,
  year: 365 * 24 * 60 * 60,
}

export const costPerTier: ICostPerTier = {
  1: 5,
  2: 10,
  3: 30,
}

export const dateMask = 'Do of MMM YY'

export const palette = {
  background: {
    color: '#01030b',
    accent: '#e06a41',
    gradient:
      'linear-gradient(117deg, rgba(16,14,24,1) 0%, rgba(51,45,69,1) 36%, rgba(16,14,24,1) 72%)',
  },
  main: {
    text: '#fafafa',
    title: '#f67447',
    buttonBg: '#081429',
    buttonBorder: '#d34715',
    buttonLightBorder: '#f67447',
    button: '#f67447',
    buttonHover: '#c55d39',
    outerGlow: '#e87147',
  },
  footer: {
    text: 'rgba(250, 250, 250, 0.65)',
    title: '#f67447',
    extra: '#fafafa',
  },
}
