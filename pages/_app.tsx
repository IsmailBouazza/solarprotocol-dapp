import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/ubuntu'
import { ChakraProvider } from '@chakra-ui/react'
import { createClient, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ftmChain } from '../config/constants'
import { ethers } from 'ethers'

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains: [ftmChain] }),
    new CoinbaseWalletConnector({
      chains: [ftmChain],
      options: {
        appName: 'Solar Protocol',
      },
    }),
    new WalletConnectConnector({
      chains: [ftmChain],
      options: {
        qrcode: true,
      },
    }),
  ],
  provider: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/'),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
