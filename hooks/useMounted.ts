import { useEffect, useState } from 'react'

export default function useMounted() {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  return isMounted
}
