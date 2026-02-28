import { t } from "i18next";

 export function formatTime (dateString: string) : {key : string, ns : string, count?: number, msg?: string} {
 const isValidISOFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/
  const definedTime = new Date(dateString).getTime()
  if(isNaN(definedTime) 
    || !isValidISOFormat.test(dateString) 
    || Date.now() - new Date(definedTime).getTime() < -100 ) return {
    key : "clientMessages.INVALID_DATE",
    ns: "messages",
    msg: 'invalid date'
  }

  const milliseconds = (Date.now() - definedTime)
  const secondsAgo = milliseconds / 1000
  const minutes = secondsAgo / 60;
  const hours = minutes / 60;
  const days = hours / 24
  const months = days / 30
  const years = months / 12


    if(milliseconds < 1) return {
    key :"labels.justNow",
    ns:"common",
    msg : 'fresh',
    };

    if(secondsAgo < 1) return {
    key: `labels.msAgo`,
    ns: "common",
    count: Math.round(milliseconds),
    msg : 'time in ms'
    };

    if(minutes < 1) return {
    key: `labels.seconds`,
    ns: "common",
    count: Math.round(secondsAgo),
    msg : 'time in seconds'
    };

    if(hours < 1) return {
    key: `labels.minutes`,
    ns: "common",
    count: Math.round(minutes),
    msg : 'time in minutes'
    };

    if(days < 1) return {
    key: `labels.hours`,
    ns: "common",
    count: Math.round(hours),
    msg : 'time in hours'
    };

    if(months < 1) return {
    key: `labels.days`,
    ns: "common",
    count: Math.round(days),
    msg : 'time in days'
    };

    if(years < 1) return {
    key: `labels.months`,
    ns: "common",
    count: Math.round(months),
    msg : 'time in months'
    };

    return {
    key: `labels.years`,
    ns: "common",
    count: Math.round(years),
    msg : 'time in years'
    };
 }