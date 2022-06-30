import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/ubuntu'
import { ChakraProvider } from '@chakra-ui/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ftmChain } from '../config/constants'
import SideBarWrapper from '../components/sidebar'
import { theme } from '../config/theme'

const { provider } = configureChains(
  [ftmChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== ftmChain.id) return null
        return { http: chain.rpcUrls.default }
      },
    }),
  ]
)

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
  provider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <SideBarWrapper>
          <Component {...pageProps} />
        </SideBarWrapper>
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
