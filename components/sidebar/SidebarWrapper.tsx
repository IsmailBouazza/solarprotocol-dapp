import React, { ReactNode, ReactText, useMemo } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Grid,
  VStack,
  Image,
  Divider,
  Link,
} from '@chakra-ui/react'
import { FiExternalLink, FiHome, FiMenu } from 'react-icons/fi'
import { IconType } from 'react-icons'
import ConnectWalletButton from '../connectWalletButton'
import { BiCalculator } from 'react-icons/bi'
import { VscAccount } from 'react-icons/vsc'
import { useRouter } from 'next/router'
import { palette } from '../../config/constants'
import backgroundImage from '../../media/bg.png'

interface LinkItemProps {
  name: ReactText
  icon: IconType
  link: string
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, link: '/' },
  { name: 'Calculator', icon: BiCalculator, link: '/calculator' },
  { name: 'My account', icon: VscAccount, link: '/account' },
]

export default function SideBarWrapper({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box
      minH="100vh"
      backgroundImage={backgroundImage.src}
      bgRepeat={'no-repeat'}
      backgroundSize={'cover'}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'flex' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'grid', md: 'none' }} onOpen={onOpen} />
      <Flex
        ml={{ base: 0, md: '10rem' }}
        p="4"
        py={16}
        position="relative"
        minH="100vh"
        justifyContent={'center'}
        alignItems="center"
      >
        <Box
          position="absolute"
          top="0%"
          right="0%"
          m={2}
          display={{ base: 'none', md: 'block' }}
        >
          <ConnectWalletButton />
        </Box>
        {children}
      </Flex>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter()
  return (
    <VStack
      backdropFilter="auto"
      backdropBlur="3px"
      backdropSaturate={'100%'}
      backgroundColor="rgba(50, 50, 50, 0.2)"
      borderRight="2px"
      borderRightColor={palette.main.buttonLightBorder}
      justifyContent="space-between"
      color={palette.main.buttonLightBorder}
      py={4}
      w={{ base: 'full', md: '10rem' }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <VStack w="full">
        <Flex h="20" alignItems="center" w="full" justifyContent={'center'}>
          <Image
            onClick={() => router.push('/', undefined, { shallow: true })}
            src="https://raw.githubusercontent.com/SolarProtocol/Media/main/LOGOS%20SOLAR%20PROTOCOL%20PNG/4%20SOLAR%20simbolo%20fondo%20transparente.png"
            objectFit="contain"
            h="64px"
            alt="Solar Logo"
            cursor={'pointer'}
          />
          <CloseButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onClose}
          />
        </Flex>
        <Divider
          mx={8}
          w="80%"
          borderBottomWidth="2px"
          borderBottomColor={palette.main.buttonLightBorder}
          opacity={1}
        />
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            link={link.link}
            onClose={onClose}
          >
            {link.name}
          </NavItem>
        ))}
      </VStack>
      <VStack w="full">
        <Link
          href="https://beets.fi/#/trade/0x04068da6c83afcfa0e13ba15a6696662335d5b75/0x08d70A47D3f28BbF755ae050a783844b40ae5761"
          isExternal
          color={'white'}
          fontWeight="bold"
          gap={2}
          display="flex"
          alignItems={'center'}
          flexDirection="row"
        >
          Buy $KELVIN
          <FiExternalLink />
        </Link>
      </VStack>
    </VStack>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  link: string
  children: ReactText
  onClose: () => void
}
const NavItem = ({ icon, link, children, onClose }: NavItemProps) => {
  const router = useRouter()
  const isSelected = useMemo(() => {
    return router.pathname === link
  }, [link, router.pathname])
  return (
    <VStack
      w="90%"
      p={4}
      onClick={() => {
        onClose()
        router.push(link, undefined, { shallow: true })
      }}
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: palette.main.buttonLightBorder,
        color: 'white',
      }}
      border={
        isSelected
          ? `2px solid ${palette.main.buttonLightBorder}`
          : '2px solid transparent'
      }
      textAlign="center"
    >
      <Icon
        fontSize="2xl"
        _groupHover={{
          color: 'white',
        }}
        as={icon}
      />

      <Text>{children}</Text>
    </VStack>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Grid
      ml={{ base: 0, md: '10rem' }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="space-between"
      alignContent={'center'}
      templateColumns={'1fr 1fr'}
      {...rest}
    >
      <IconButton
        variant="outline"
        w="fit-content"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <ConnectWalletButton />
    </Grid>
  )
}
