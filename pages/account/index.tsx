import { NextPage } from 'next'
import Head from 'next/head'
import AccountContent from '../../components/AccountContent'

const Account: NextPage = () => {
  return (
    <>
      <Head>
        <title>Account | Solar Protocol</title>
      </Head>
      <AccountContent />
    </>
  )
}
export default Account
