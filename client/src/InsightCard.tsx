import clsx from 'clsx';
import React, { type FC } from 'react'
import * as skeletons from "./components/skeletons/chartSkeletons"

const colorMap =  {
    success: {
        div : "from-success/10 border-success/20",
        span : "bg-success text-success-content"
    },
    info: {
        div : "from-info/10 border-info/20",
        span : "bg-info text-info-content"
    },
    warning: {
        div : "from-warning/10 border-warning/20",
        span : "bg-warning text-warning-content"
    }
  };

interface InsightCardProps  {
 icon : React.ComponentType<{size : number}>,
 label : string,
 color :  "success" | "info" | "warning"
 title : string
 isLoading : boolean
}

const InsightCard : FC<InsightCardProps> = React.memo(({icon: Icon, label, color, title, isLoading}) => {
  return (
    <>
    {isLoading ? <skeletons.InsightCardSkeleton/> 
    : (<div className={clsx("bg-gradient-to-br to-base-100 rounded-lg border p-5", colorMap[color].div)}>
     <h3 className='font-semibold text-base-content mb-2 flex items-center gap-1.5'>
      <span className={clsx("p-1 rounded shadow-sm", colorMap[color].span)}>
        <Icon size={20}/>
      </span>
       {title}
    </h3>
    <p className='text-sm text-base-content/70'>
     {label}
    </p>
    </div>)
    }
    </>
    
  )
})

export default InsightCard
