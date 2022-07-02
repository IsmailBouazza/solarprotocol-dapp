import { Tooltip, Button } from '@chakra-ui/react'
import { IEpoch } from '../../config/types'

interface InvestButtonProps {
  isLoading: boolean
  currentEpoch: IEpoch
  amount: number
  max: number
  issued: number
  invest: (number: number) => void
}
export default function InvestButton({
  currentEpoch,
  isLoading,
  issued,
  max,
  amount,
  invest,
}: InvestButtonProps) {
  return (
    <>
      {max - issued >= amount ? (
        <>
          {isLoading ? (
            <Button isLoading onClick={() => invest(amount)}>
              Buy {amount} $nKELVIN
            </Button>
          ) : (
            <Tooltip
              hasArrow
              label={
                currentEpoch && `Cost: ${currentEpoch.price * amount}$USDC`
              }
              aria-label={`Cost of ${amount}`}
            >
              <Button onClick={() => invest(amount)}>
                Buy {amount} $nKELVIN
              </Button>
            </Tooltip>
          )}
        </>
      ) : (
        <Button disabled onClick={() => invest(amount)}>
          Allocation exceeded
        </Button>
      )}
    </>
  )
}
