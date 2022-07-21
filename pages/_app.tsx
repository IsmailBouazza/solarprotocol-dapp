import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/ubuntu'
import { ChakraProvider } from '@chakra-ui/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { ToastContainer } from 'react-toastify'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ftmChain } from '../config/constants'
import SideBarWrapper from '../components/sidebar'
import { theme } from '../config/theme'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { SolarProvider } from '../context/SolarContext'
import 'react-toastify/dist/ReactToastify.css'
import useMounted from '../hooks/useMounted'
import { useEffect } from 'react'

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
  provider,
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
})

function MyApp({ Component, pageProps }: AppProps) {
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return
    const item = localStorage.getItem('chakra-ui-color-mode')
    if (!item || item === 'dark') return
    localStorage.setItem('chakra-ui-color-mode', 'dark')
  }, [mounted])
  return (
    <WagmiConfig client={wagmiClient}>
      <SolarProvider>
        <ChakraProvider theme={theme}>
          <SideBarWrapper>
            <Component {...pageProps} />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </SideBarWrapper>
        </ChakraProvider>
      </SolarProvider>
    </WagmiConfig>
  )
}

export default MyApp
