import useEvent from './useEvent'
import { useThrottle } from './useThrottle'

const win = typeof window === 'undefined' ? null : window
const getScrollY = (): number =>
  (win as Window).scrollY !== void 0
    ? (win as Window).scrollY
    : (win as Window).screenX === void 0
    ? 0
    : (win as Window).screenY

export const useWindowScroll = (fps = 30): number => {
  const state = useThrottle(
    typeof window === 'undefined' ? 0 : getScrollY,
    fps,
    true
  )
  useEvent(win, 'scroll', (): void => state[1](getScrollY()))
  return state[0]
}

export default useWindowScroll