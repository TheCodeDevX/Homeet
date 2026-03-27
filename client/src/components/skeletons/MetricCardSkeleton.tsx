const MetricCardSkeleton: React.FC = () => (
  <div className='bg-base-100 rounded-lg border border-base-200 p-5 space-y-3'>
    {/* Header with label and icon */}
    <div className='flex items-start justify-between'>
      {/* Left side - Label and Value */}
      <div className='space-y-2 flex-1'>
        {/* Label skeleton */}
        <div className='h-3.5 bg-base-300 rounded w-28 animate-pulse' />
        
        {/* Value skeleton */}
        <div className='h-8 bg-base-300 rounded w-40 animate-pulse' />
      </div>

      {/* Icon skeleton */}
      <div className='bg-base-300 p-3 rounded-lg w-12 h-12 animate-pulse' />
    </div>

    {/* Trend section */}
    <div className='border-t border-base-200 pt-2'>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 bg-base-300 rounded-full animate-pulse' />
        <div className='h-3 bg-base-300 rounded w-24 animate-pulse' />
      </div>
    </div>
  </div>
)

export default MetricCardSkeleton

