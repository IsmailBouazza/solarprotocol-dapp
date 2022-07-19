import { HStack, VStack, Radio, Text } from '@chakra-ui/react'
import Image, { StaticImageData } from 'next/image'
import { palette, secondsByDuration } from '../../config/constants'
import { IMintStarCardProps } from '../../config/types'
import proton from '../../src/proto.png'
import quasar from '../../src/quasar.png'
import neutron from '../../src/neutron.png'
import useWeb3Formatter from '../../hooks/useWeb3Formatter'

const imgs: { [key: number]: StaticImageData } = {
  1: proton,
  2: neutron,
  3: quasar,
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
        <HStack>
          <Text fontWeight={'bold'} fontSize="lg">
            {starType.name}
          </Text>
          {/* <FiInfo color="white" /> */}
        </HStack>
        {/* </Tooltip> */}
        <Text>{balanceToNumber(starType.price, 18)}</Text>
        <Text>{balanceToNumber(starType.stablePrice, 6)}</Text>
        <Text>
          {(
            balanceToNumber(starType.rewardsPerSecond, 18) *
            secondsByDuration['day']
          ).toFixed(2)}
        </Text>
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
