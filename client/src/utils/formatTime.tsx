import { t } from "i18next";

 export function formatTime (time: string) {
  const definedTime = new Date(time).getTime()
  if(isNaN(definedTime)) return "invalid time"
  const secondsAgo = (Date.now() - definedTime) / 1000 as number

  const milliseconds = secondsAgo * 1000
  const minutes = secondsAgo / 60;
  const hours = minutes / 60;
  const days = hours / 24
  const months = days / 30
  const years = months / 12


    if(secondsAgo < 0) return t("labels.justNow", {ns:"common"})
    if(secondsAgo < 1) return t(`labels.msAgo${milliseconds === 1 ? "_one" : "_other"}`,
    {ns:"common", count: Math.round(secondsAgo)})
    if(minutes < 1) return t(`labels.seconds${secondsAgo === 1 ? "_one" : "_other"}`, {ns:"common", count: Math.round(secondsAgo)})
    if(hours < 1) return t(`labels.minutes${minutes === 1 ? "_one" : "_other"}`, {ns:"common", count: Math.round(minutes)})
    if(days < 1) return t(`labels.hours${hours === 1 ? "_one" : "_other"}`, {ns:"common", count: Math.round(hours)})
    if(months < 1) return t(`labels.days${days === 1 ? "_one" : "_other"}`, {ns:"common", count: Math.round(days)})
    if(years < 1) return t(`labels.months${months === 1 ? "_one" : "_other"}`, {ns:"common", count: Math.round(months)})
    return t(`labels.years${years === 1 ? "_one" : "_other"}`, {ns:"common", count: Math.round(years)})
 }