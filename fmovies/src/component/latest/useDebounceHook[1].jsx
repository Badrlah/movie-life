import { useDebounce } from 'use-debounce'
export default function useDebounceHook(value) {
    const [search] =useDebounce(value,1000)

  return ({search})
}
