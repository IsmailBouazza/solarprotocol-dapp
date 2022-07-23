import { VStack, Grid, Text, Spinner, Tooltip } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import { palette } from '../../config/constants'
import { IStarTypes } from '../../config/types'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'

export default function SolarStats({
  price,
  stars,
}: {
  price: number
  stars: IStarTypes
}) {
  const { balanceToNumber } = useWeb3Formatter()
  const tvl = useMemo(() => {
    if (
      !stars.neutronCount ||
      !stars.quasarCount ||
      !stars.protoCount ||
      !stars.types
    )
      return undefined
    let value = 0
    stars.types.map((val) => {
      const typeValue =
        balanceToNumber(val.price, 18) * price +
        balanceToNumber(val.stablePrice, 6)
      if (val.id === 1 && stars.protoCount)
        value += typeValue * stars.protoCount
      else if (val.id === 2 && stars.neutronCount)
        value += typeValue * stars.neutronCount
      else if (val.id === 3 && stars.quasarCount)
        value += typeValue * stars.quasarCount
    })

    return value
  }, [
    balanceToNumber,
    price,
    stars.neutronCount,
    stars.protoCount,
    stars.quasarCount,
    stars.types,
  ])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <VStack
      w="full"
      bg={palette.background.gradient}
      rounded={'xl'}
      p={4}
      justifyContent={'center'}
      border={`2px solid ${palette.main.buttonLightBorder}`}
    >
      <Text fontSize={'4xl'} textAlign={'center'}>
        SOLAR <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
      </Text>
      <Grid templateColumns={'repeat(2,1fr)'} w="100%" justifyItems={'start'}>
        {isOpen ? (
          <Tooltip label="TVL = Star count * Star value" hasArrow isOpen>
            <Text
              alignSelf={'start'}
              fontWeight="bold"
              display="flex"
              flexDirection={'row'}
              alignItems="center"
              gap={2}
              onClick={() => setIsOpen(false)}
            >
              TVL <FiInfo />
            </Text>
          </Tooltip>
        ) : (
          <Tooltip label="TVL = Star count * Star value" hasArrow>
            <Text
              alignSelf={'start'}
              fontWeight="bold"
              display="flex"
              flexDirection={'row'}
              alignItems="center"
              gap={2}
              onClick={() => setIsOpen(true)}
            >
              TVL <FiInfo />
            </Text>
          </Tooltip>
        )}

        {tvl === undefined ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Text alignSelf={'end'}>${tvl.toLocaleString('en-GB')}</Text>
        )}

        <Text alignSelf={'start'} fontWeight="bold">
          Proto Stars
        </Text>
        {stars.protoCount === undefined ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Text alignSelf={'end'}>{stars.protoCount}</Text>
        )}
        <Text alignSelf={'start'} fontWeight="bold">
          Neutron Stars
        </Text>
        {stars.neutronCount === undefined ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Text alignSelf={'end'}>{stars.neutronCount}</Text>
        )}
        <Text alignSelf={'start'} fontWeight="bold">
          Quasars
        </Text>
        {stars.quasarCount === undefined ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Text alignSelf={'end'}>{stars.quasarCount}</Text>
        )}
      </Grid>
    </VStack>
  )
}
