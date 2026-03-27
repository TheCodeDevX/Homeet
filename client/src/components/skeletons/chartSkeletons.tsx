// ChartSkeletons.tsx — add these skeleton components

const RevenueTrendSkeleton = () => (
  <div className="lg:col-span-2 bg-base-100 rounded-lg border border-base-200 p-5 animate-pulse">
    <div className="h-5 w-40 bg-base-300 rounded mb-4" />
    <div className="flex items-end gap-2 h-[300px] pt-6">
      {/* Y-axis */}
      <div className="flex flex-col justify-between h-full pb-6 gap-1 w-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 w-full bg-base-300 rounded" />
        ))}
      </div>
      {/* Bars/line simulation */}
      <div className="flex-1 flex flex-col justify-between h-full">
        <div className="flex-1 relative">
          {/* Fake grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute w-full h-px bg-base-300"
              style={{ top: `${i * 25}%` }} />
          ))}
          {/* Fake line path as a series of dots */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polyline
              points="0,80 70,60 140,70 210,40 280,55 350,30 420,45 490,20 560,35 630,25 700,15 770,30"
              fill="none"
              stroke="oklch(var(--bc)/0.15)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* X-axis labels */}
        <div className="flex justify-between pt-2">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
            <div key={m} className="h-3 w-5 bg-base-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

const GuestDistributionSkeleton = () => (
  <div className="bg-base-100 rounded-lg border border-base-200 p-5 animate-pulse">
    <div className="h-5 w-36 bg-base-300 rounded mb-4" />
    <div className="flex items-center justify-center h-[300px]">
      {/* Donut ring */}
      <div className="relative w-[160px] h-[160px]">
        <div className="w-full h-full rounded-full bg-base-300" />
        <div className="absolute inset-[28px] rounded-full bg-base-100" />
      </div>
    </div>
    <div className="space-y-2 mt-4">
      {['Solo', 'Couples', 'Families', 'Groups'].map((label) => (
        <div key={label} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-base-300" />
            <div className="h-3 w-14 bg-base-300 rounded" />
          </div>
          <div className="h-3 w-8 bg-base-300 rounded" />
        </div>
      ))}
    </div>
  </div>
)

const BookingByListingSkeleton = () => (
  <div className="bg-base-100 rounded-lg border border-base-200 p-5 mb-8 animate-pulse">
    <div className="h-5 w-44 bg-base-300 rounded mb-4" />
    <div className="flex items-end gap-4 h-[300px] pt-4">
      {/* Y-axis */}
      <div className="flex flex-col justify-between h-full pb-8 w-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 w-full bg-base-300 rounded" />
        ))}
      </div>
      {/* Bars */}
      <div className="flex-1 flex items-end gap-3 h-full pb-8">
        {[65, 90, 45, 75, 55, 80].map((height, i) => (
          <div key={i} className="flex-1 flex gap-1 items-end">
            <div className="flex-1 bg-base-300 rounded-t-lg"
              style={{ height: `${height}%` }} />
            <div className="flex-1 bg-base-300 rounded-t-lg"
              style={{ height: `${height * 0.7}%` }} />
          </div>
        ))}
      </div>
    </div>
    {/* X labels */}
    <div className="flex gap-3 mt-1 pl-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-1 h-3 bg-base-300 rounded" />
      ))}
    </div>
  </div>
)

const InsightCardSkeleton = () => (
  <div className="bg-gradient-to-br to-base-100 from-base-300/30 border border-base-300/40 rounded-lg p-5 animate-pulse">
    <div className="flex items-center gap-1.5 mb-2">
      <div className="w-8 h-8 rounded bg-base-300" />
      <div className="h-4 w-28 bg-base-300 rounded" />
    </div>
    <div className="space-y-1.5 mt-3">
      <div className="h-3 w-full bg-base-300 rounded" />
      <div className="h-3 w-4/5 bg-base-300 rounded" />
    </div>
  </div>
)

export {RevenueTrendSkeleton, GuestDistributionSkeleton, BookingByListingSkeleton, InsightCardSkeleton}