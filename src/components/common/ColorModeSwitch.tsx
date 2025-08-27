'use client'
import { useAtom } from 'jotai'
import darkModeAtom from '@/atoms/darkModeAtom'
import { Moon, Sun } from 'lucide-react'

interface colorModeSwitchProps {
  className?: string
}

const ColorModeSwitch = ({ className }: colorModeSwitchProps) => {
  const [colorMode, toggleColorMode] = useAtom(darkModeAtom)

  return (
    <button
      type="button"
      onClick={() =>
        colorMode === 'light'
          ? toggleColorMode('dark')
          : toggleColorMode('light')
      }
      className={className}
    >
      {colorMode === 'light' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ColorModeSwitch