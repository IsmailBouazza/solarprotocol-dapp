import { HStack, VStack, Radio, Text, Tooltip } from '@chakra-ui/react'
import Image, { StaticImageData } from 'next/image'
import { palette, secondsByDuration } from '../../config/constants'
import { IMintStarCardProps } from '../../config/types'
import proton from '../../src/proto.png'
import quasar from '../../src/quasar.png'
import neutron from '../../src/neutron.png'
import nebula from '../../src/nebula.png'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'
import { FiInfo } from 'react-icons/fi'

const imgs: { [key: number]: StaticImageData } = {
  1: proton,
  2: neutron,
  3: quasar,
  4: nebula,
}

export default function MintStarCard({
  selectedType,
  setSelectedType,
  starType,
}: IMintStarCardProps) {
  const { balanceToNumber } = useWeb3Formatter()

  return (
    <HStack
      w="full"
      border={`2px solid ${palette.main.buttonLightBorder}`}
      rounded="xl"
      p={4}
      gap={4}
      className="smallglow"
      cursor={'pointer'}
      onClick={() => setSelectedType(starType.id)}
    >
      <Image
        src={imgs[starType.id]}
        objectFit="contain"
        alt={'star logo'}
        width="80px"
        height={'80px'}
      />
      <VStack w="100%" alignItems={'start'}>
        {/* <Tooltip label="Quasar" hasArrow> */}
        <HStack w="full" justifyContent={'space-between'}>
          <Text fontWeight={'bold'} fontSize="lg">
            {starType.name}
          </Text>
          {/* <FiInfo color="white" /> */}
        </HStack>
        {/* </Tooltip> */}

        <Tooltip
          label={`Rewards are rounded to 2 decimals, actual number is ${
            balanceToNumber(starType.rewardsPerSecond, 18) *
            secondsByDuration['day']
          }`}
          hasArrow
          aria-label="Real rewards"
        >
          <HStack>
            <Text>
              <b> Rewards per day:</b>{' '}
              {(
                balanceToNumber(starType.rewardsPerSecond, 18) *
                secondsByDuration['day']
              ).toFixed(2)}
              $KELVIN
            </Text>
            <FiInfo color="white" />
          </HStack>
        </Tooltip>
        <Text>
          <b>Cost: </b> {balanceToNumber(starType.price, 18)} $KELVIN,{' | '}
          {balanceToNumber(starType.stablePrice, 6)} $USDC
        </Text>
        <Text>Maintenance Fees: {starType.monthlyFees}$USDC/month</Text>
      </VStack>
      {selectedType === starType.id ? (
        <Radio isChecked colorScheme={'purple'} />
      ) : (
        <Radio
          colorScheme={'purple'}
          onClick={() => setSelectedType(starType.id)}
        />
      )}
    </HStack>
  )
}
