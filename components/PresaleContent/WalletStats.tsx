import { Grid, Spinner, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { palette, presaleContractConfig } from '../../config/constants'

export default function WalletStats() {
  // WEB3
  const { data: userData } = useAccount()
  // userCap
  const [userCap, setUserCap] = useState<number>(0)
  const { isError: userCapErr, isLoading: userCapLoad } = useContractRead(
    presaleContractConfig,
    'getUserCap',
    {
      chainId: 250,
      onSettled(data, error) {
        if (error) console.log('💰 Error on userCap', error)
        const formatted = Number(
          ethers.utils.formatEther(data as unknown as string)
        )
        console.log('💰 userCap', formatted)
        setUserCap(formatted)
      },
    }
  )

  // investorIssued
  const [investorIssued, setInvestorIssued] = useState<number>(0)
  const { isError: investorIssuedErr, isLoading: investorIssuedLoad } =
    useContractRead(presaleContractConfig, 'balanceOf', {
      chainId: 250,
      args: [userData?.address],
      onSettled(data, error) {
        if (error) console.log('💰 Error on investorIssued', error)
        const formatted = Number(
          ethers.utils.formatEther(data as unknown as string)
        )
        console.log('💰 investorIssued', formatted)
        setInvestorIssued(formatted)
      },
    })

  return (
    <>
      <Text fontSize={'4xl'}>
        Wallet <b style={{ color: palette.main.buttonLightBorder }}>Stats</b>
      </Text>
      <Grid
        templateColumns={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        fontSize={'xl'}
        w="full"
        justifyItems={'center'}
      >
        {userCapErr ? (
          <Text>Error fetching userCap</Text>
        ) : userCapLoad ? (
          <Spinner />
        ) : (
          <Text justifySelf={'start'}>Max. allocation: {userCap}$nKELVIN</Text>
        )}
        {investorIssuedErr ? (
          <Text justifySelf={'center'}>Error fetching investorIssued</Text>
        ) : investorIssuedLoad ? (
          <Spinner />
        ) : (
          <Text justifySelf={'center'}>
            Tokens purchased: {investorIssued}$nKELVIN
          </Text>
        )}
        <Text justifySelf={'end'}>
          Available: {userCap - investorIssued}$nKELVIN
        </Text>
      </Grid>
    </>
  )
}
