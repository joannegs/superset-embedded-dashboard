import type { ComponentType, SVGProps } from 'react'
import type { View } from '../../types/navigation.types'
import { HomeIcon, InfoIcon } from '../ui/Icons'

interface NavItem {
  view: View
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const NAV_ITEMS: NavItem[] = [
  { view: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { view: 'about', label: 'About', icon: InfoIcon },
]
