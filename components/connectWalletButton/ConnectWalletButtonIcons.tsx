import { Image } from '@chakra-ui/react'
import { connectorIcons } from '../../config/constants'
export default function ConnectWalletButtonIcons({
  connector,
}: {
  connector: string
}) {
  return (
    <>
      <Image
        src={connectorIcons[connector].logoURI}
        alt={`${connector} logo`}
        objectFit="contain"
        h="32px"
      />
    </>
  )
}
