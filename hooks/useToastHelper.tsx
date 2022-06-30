import { useToast } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function useToastHelper() {
  const toastFactory = useToast({
    position: 'top-right',
    isClosable: true,
    duration: 3000,
    variant: 'left-accent',
  })

  function summonToast(
    id: string,
    status: 'info' | 'warning' | 'success' | 'error' | 'loading' | undefined,
    description: ReactNode
  ) {
    if (toastFactory.isActive(id)) return
    toastFactory({
      id: id,
      status: status,
      description: description,
      position: 'bottom',
    })
  }
  return { toastFactory, summonToast }
}
