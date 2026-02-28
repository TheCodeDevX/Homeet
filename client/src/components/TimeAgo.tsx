import { memo } from 'react'
import { formatTime } from '../utils/formatTime'
import { t } from 'i18next'

const TimeAgo = memo(({date} : {date : string, lang : string}) => {
const {key, ns, count} = formatTime(date);
  return (
      <span className="text-xs opacity-80 flex items-center">
       {t(key, {ns, count})}
       </span>
  )
})

export default TimeAgo
