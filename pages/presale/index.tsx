import { VStack } from '@chakra-ui/react'
import { NextPage } from 'next'
import PresaleContent from '../../components/PresaleContent'
import { palette } from '../../config/constants'

const Presale: NextPage = () => {
  return (
    <VStack
      w={{ base: '90%', md: '80%' }}
      p={8}
      alignItems="center"
      justifyContent="start"
      h="full"
      className="shadowglow"
      border={`1px solid ${palette.main.buttonLightBorder}`}
      rounded="xl"
      bg={palette.background.gradient}
      bgRepeat="no-repeat"
      bgAttachment={'fixed'}
      position="relative"
      gap={4}
    >
      <PresaleContent />
    </VStack>
  )
}
export default Presale
