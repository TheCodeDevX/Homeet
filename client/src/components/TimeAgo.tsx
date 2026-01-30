import { memo } from 'react'
import { formatTime } from '../utils/formatTime'

const TimeAgo = memo(({time} : {time : string, lang : string}) => {
  return (
      <span className="text-xs opacity-80 flex items-center">
       {formatTime(time)}
       </span>
  )
})

export default TimeAgo
