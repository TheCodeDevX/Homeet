import React from 'react'
import {motion} from 'framer-motion'
import type { MetricCardProps } from '../types/types'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { t } from 'i18next'



const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit = '',
  icon: Icon,
  trend,
  color = 'primary'
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className='bg-base-100 rounded-lg border border-base-200 p-5 space-y-3'
  >
    <div className='flex items-start justify-between'>
      <div className='space-y-1'>
        <p className='text-xs sm:text-sm font-medium text-base-content/60 uppercase tracking-wide'>
          {label}
        </p>
        <p className='text-2xl sm:text-3xl font-bold text-base-content'>
          {value}{unit}
        </p>
      </div>
      <div className={`bg-${color}/10 text-${color} p-3 rounded-lg`}>
        <Icon size={24} />
      </div>
    </div>

    {trend && (
      <div className='flex items-center gap-2 text-xs pt-2 border-t border-base-200'>

        {trend.trendStatus === "neutral" && (
          <ArrowRight className='text-accent' size={16} />)}

        {trend.trendStatus === "positive" &&  (
          <ArrowUpRight className='text-success' size={16} /> )}
        
        {trend.trendStatus === "negative" && (
        ( <ArrowDownRight className='text-error' size={16} />))}

        <span className={
          trend.trendStatus === "n/a"
          ? "text-warning"
          : trend.trendStatus === "neutral" 
          ? "text-accent" 
          : trend.trendStatus === "positive"
          ? 'text-success'
          : 'text-error'
           }>
          { trend.value === "N/A" 
          ? t("dashboard.metrics.N/A", {ns : "dashboard"})
          : t("dashboard.metrics.TREND_PERCENTAGE", {ns : "dashboard", percentage : trend.value})
           }
        </span>
      </div>
    )}
  </motion.div>
)
 
 
 export default MetricCard
 