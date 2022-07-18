import type { NextPage } from 'next'
import Head from 'next/head'
import HomeContent from '../components/HomeContent'

export const getStaticProps = async () => {
  // GraphQL Query
  const req = await fetch(
    'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx',
    {
      headers: {
        accept: 'application/json, multipart/mixed',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/json',
        'sec-ch-ua':
          '"Chromium";v="102", "Opera GX";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        Referer:
          'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx/graphql?query=query+knsPool+%7B%0A++pool%28id%3A+%220x28b8d52a695f485900a6de3ea0352b8e3891d2db0002000000000000000004f1%22%29+%7B%0A++++address%0A++++swapFee%0A++++tokens+%7B%0A++++++balance%0A++++++weight%0A++++++decimals%0A++++++name%0A++++++address%0A++++++symbol%0A++++%7D%0A++%7D%0A%7D',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: '{"query":"query knsPool {\\n  pool(id: \\"0x28b8d52a695f485900a6de3ea0352b8e3891d2db0002000000000000000004f1\\") {\\n    address\\n    swapFee\\n    tokens {\\n      balance\\n      weight\\n      decimals\\n      name\\n      address\\n      symbol\\n    }\\n  }\\n}","variables":null,"operationName":"knsPool","extensions":{"headers":null}}',
      method: 'POST',
    }
  )

  const res = await req.json()
  return {
    props: {
      poolInfo: res,
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Home: NextPage = ({ poolInfo }: any) => {
  return (
    <>
      <Head>
        <title>Home | Solar Protocol</title>
      </Head>
      <HomeContent poolInfo={poolInfo} />
    </>
  )
}

export default Home
