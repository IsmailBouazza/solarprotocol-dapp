import { Grid, HStack, Text, Tooltip } from '@chakra-ui/react'
import { useContext } from 'react'
import { FiInfo } from 'react-icons/fi'
import { palette } from '../../config/constants'
import { SolarContext } from '../../context/SolarContext'

export default function WalletStats() {
  const { Presale } = useContext(SolarContext)
  return (
    <>
      <Text fontSize={'4xl'} textAlign={'center'}>
        Wallet <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
      </Text>
      <Grid
        templateColumns={{
          base: '1fr',
          '2xl': 'repeat(3, 1fr)',
        }}
        fontSize={'xl'}
        w="full"
        justifyItems={'center'}
        textAlign="center"
      >
        {Presale.userCap && (
          <Tooltip label="Max $nKELVIN allocation per wallet." hasArrow>
            <HStack justifySelf={{ base: 'center', '2xl': 'start' }}>
              <Text>Max. allocation: {Presale.userCap}$nKELVIN</Text>
              <FiInfo color="white" />
            </HStack>
          </Tooltip>
        )}

        {Presale.tokensIssued !== undefined && (
          <Tooltip label="$nKELVIN purchased by this wallet." hasArrow>
            <HStack justifySelf={'center'} textAlign="center">
              <Text>Tokens purchased: {Presale.tokensIssued}$nKELVIN</Text>

              <FiInfo color="white" />
            </HStack>
          </Tooltip>
        )}
        {Presale.userCap !== undefined && Presale.tokensIssued !== undefined && (
          <Tooltip label="$nKELVIN tokens available for this wallet." hasArrow>
            <HStack justifySelf={{ base: 'center', '2xl': 'end' }}>
              <Text>
                Available: {Presale.userCap - Presale.tokensIssued}$nKELVIN
              </Text>
              <FiInfo color="white" />
            </HStack>
          </Tooltip>
        )}
      </Grid>
    </>
  )
}
