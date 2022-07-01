import { Heading, HStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | Solar Protocol</title>
      </Head>
      <HStack w={'full'} alignItems="center" justifyContent="center" h="full">
        <Heading>COMING SOON</Heading>
      </HStack>
    </>
  )
}

export default Home
