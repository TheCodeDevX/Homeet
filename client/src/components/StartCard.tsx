import type { JSX } from "react";

interface ColorMap {
    primary: string;
    success: string;
    info: string;
    warning: string;
    error: string;
}

interface StatCardProps {
    icon : JSX.Element,
    label : string,
    labelFull?: string,
    value : number,
    color : keyof ColorMap
}

const StatCard = ({ icon, label, labelFull, value, color = 'primary' } : StatCardProps) => {
 

  const colorMap : ColorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    info: 'bg-info/10 text-info',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };
  return (
    <div className='bg-base-100 rounded-lg border border-base-200 hover:border-primary/30 
    shadow-sm hover:shadow-md transition-all duration-200 p-3 sm:p-5 space-y-2 sm:space-y-3'>
      
      {/* Icon */}
      <div className={`${colorMap[color]} w-fit p-2 sm:p-3 rounded-lg`}>
        {icon}
      </div>

      {/* Label */}
      <h3 className='text-xs sm:text-sm font-medium text-base-content/70 uppercase tracking-wide'>
        <span className='sm:hidden'>{label}</span>
        <span className='hidden sm:inline'>{labelFull}</span>
      </h3>

      {/* Value */}
      <p className='text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content'>
        {value}
      </p>
    </div>
  );
};

export default StatCard