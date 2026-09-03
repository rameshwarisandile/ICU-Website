import type { ReactNode } from 'react'
import { getRiskClasses } from '../../utils/riskUtils'
import type { RiskLevel } from '../../types/patient'

interface RiskBadgeProps {
  level: RiskLevel
  children?: ReactNode
}

const RiskBadge = ({ level, children }: RiskBadgeProps) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskClasses(level)}`}>
    {children ?? level}
  </span>
)

export default RiskBadge
