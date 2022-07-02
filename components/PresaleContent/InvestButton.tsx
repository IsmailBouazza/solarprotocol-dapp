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
    <Tooltip
      label={currentEpoch && `Cost: ${currentEpoch.price * amount}$USDC`}
      aria-label="Cost"
    >
      {max - issued >= amount ? (
        <>
          {isLoading ? (
            <Button isLoading onClick={() => invest(amount)}>
              Buy {amount} $nKELVIN
            </Button>
          ) : (
            <Button onClick={() => invest(amount)}>
              Buy {amount} $nKELVIN
            </Button>
          )}
        </>
      ) : (
        <Button disabled onClick={() => invest(amount)}>
          Allocation exceeded
        </Button>
      )}
    </Tooltip>
  )
}
