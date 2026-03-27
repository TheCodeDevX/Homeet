import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { TrendingUp, Calendar, Users, DollarSign, UserStar, StarIcon } from "lucide-react"
import { useListingStore, type ApiData, type Booking } from "../store/listingStore"
import { useEffect, useState } from "react"
import MetricCardSkeleton from "./skeletons/MetricCardSkeleton"
import InsightCard from "../InsightCard"
import * as skeletons from "../components/skeletons/chartSkeletons" 
import MetricCard from "./MetricCard"
import type { CurrencyCode, TrendStatus, UserData } from "../types/types"
import { formatCurrency } from "../utils/formatCurrency"
import { useAuthStore } from "../store/authStore"
import { convertPrice } from "../utils/convertPrice"
import { fetchCurrenciesWithRates } from "../utils/fetchCurrenciesWithRates"
import * as constants from "../constants/index"
import i18n from "../config/reacti18next"
import { useMediaQuery } from "react-responsive"



interface AnalyticsData {
  totalRevenue: number
  totalBookings: number
  totalGuests: number
  avgRating: number
  occupancyRate: number
  lastMonthRevenue: number
  thisMonthRevenue: number
  trendRevenue : number | 'N/A'
  trendBookings : number | 'N/A'
  trendGuests : number | 'N/A'
  trendOccupancyRate : number | 'N/A'
  revenueTrendStatus : TrendStatus
  bookingTrendStatus : TrendStatus
  guestTrendStatus : TrendStatus
  occupancyRateTrendStatus : TrendStatus,
  recommmendation : string

}
type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec"
interface RevenueTrendData {
  month: Month
  revenue: number
  bookings: number
}

interface BookingByListingData {
  name: string
  bookings: number
  revenue: string
}

interface GuestDistributionData {
  name: string
  value: number
  color: string
  count : number
}

const Analytics = () => {


 
  const { t } = useTranslation()
  const {userListings, getUserListings, isDashboardLoading} = useListingStore()
  const {user} = useAuthStore()
  const [currencies, setCurrencies] = useState<{
    rate: number;
    code: CurrencyCode;
    symbol: string;
    name: string;
}[] | undefined>([])
  const [revenueTrendData, setTrendRevenueData] = useState<RevenueTrendData[]>
  ([
    { month: 'Jan', revenue: 0, bookings: 0},
    { month: 'Feb', revenue: 0, bookings: 0},
    { month: 'Mar', revenue: 0, bookings: 0},
    { month: 'Apr', revenue: 0, bookings: 0},
    { month: 'May', revenue: 0, bookings: 0},
    { month: 'Jun', revenue: 0, bookings: 0},
    { month: 'Jul', revenue: 0, bookings: 0},
    { month: 'Aug', revenue: 0, bookings: 0},
    { month: 'Sep', revenue: 0, bookings: 0},
    { month: 'Oct', revenue: 0, bookings: 0},
    { month: 'Nov', revenue: 0, bookings: 0},
    { month: 'Dec', revenue: 0, bookings: 0},
  ])


    const [guestDistributionData, setGuestDistributionData] = useState<GuestDistributionData[]>([
    { name: t("dashboard.analyticsTab.solo", {ns : "dashboard"}), value: 0, color: '#3b82f6', count : 0  },
    { name: t("dashboard.analyticsTab.couples", {ns : "dashboard"}), value: 0, color: '#10b981', count : 0 },
    { name: t("dashboard.analyticsTab.families", {ns : "dashboard"}), value: 0, color: '#f59e0b', count : 0 },
    { name: t("dashboard.analyticsTab.groups", {ns : "dashboard"}), value: 0, color: '#8b5cf6', count : 0 },
    ])

  useEffect(() => {
    getUserListings();
  }, [])

   useEffect(() => {
  const fetchCurrencies = async () => {
    const result = await fetchCurrenciesWithRates("USD")
    setCurrencies(result)
  }
  fetchCurrencies()
  }, [])

  // Calculate analytics data
  const calculateAnalytics = (): AnalyticsData => {
    const totalRevenueInUSD = userListings
    .flatMap((l) => l.bookings)
    .reduce((sum, b) => sum + (b?.costPrice?.amount_usd ?? b?.offerPrice?.amount_usd ?? 0), 0)

    const calculateRevenue = () => {
     const revenue = convertPrice(totalRevenueInUSD, "USD", user?.currency?.toUpperCase() as CurrencyCode | undefined,
      currencies ?? [])
      return revenue;
    }
    const totalRevenue = calculateRevenue()
    // .reduce((sum, l) =>
    //   sum + ((l.bookings?.length ?? 0) * l.price), 0
    // )

    const totalBookings = userListings.reduce((sum, l) =>
      sum + (l.bookings?.length ?? 0), 0
    )

    const totalGuests = userListings.reduce((sum, l) =>
      sum + (l.bookings?.reduce((gSum, b) =>
        gSum + ((b?.adultsCount ?? 0) + (b?.childrenCount ?? 0)), 0) ?? 0), 0
    )

    const bookedListings = userListings
       .map((l) => l.bookings).filter((bArray) => bArray?.length !== 0 ).length

    const occupancyRate = userListings.length === 0 ? 0 : Math.round(
      (bookedListings / userListings.length) * 100
    )


    const avgRating  = (userListings.length === 0 
          ? 0
          : userListings.reduce((sum, l) => sum + (l.avgRating ?? 0), 0) / userListings.length)
    const currentDate = new Date()


    const startOfThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    const getThisMonthData = (data: Booking | ApiData) => {
     return new Date(data?.createdAt ?? '').getTime() >= startOfThisMonth.getTime()
     && new Date(data?.createdAt??"").getTime() < startOfNextMonth.getTime()
    }

     const getLastMonthData = (data : Booking | ApiData) => {
     return  new Date(data?.createdAt ?? '').getTime() < startOfThisMonth.getTime() && 
      new Date(data?.createdAt ?? "").getTime() >= startOfLastMonth.getTime()
    }

    const thisMonthRevenue = userListings.flatMap((l) => l.bookings).filter((b) =>
      getThisMonthData(b as Booking) 
    )  
     .reduce((sum, b) => sum + Number(b?.costPrice?.amount_usd ?? b?.offerPrice?.amount_usd ?? 0), 0)      

      const lastMonthRevenue = userListings.flatMap((l) => l.bookings).filter((b) => 
      getLastMonthData(b as Booking)
    ).reduce((sum, b) => sum + Number(b?.costPrice?.amount_usd ?? b?.offerPrice?.amount_usd ?? 0), 0) 


     const thisMonthBookings = userListings.flatMap((l) => l.bookings).filter((b) =>
      getThisMonthData(b as Booking) 
    )  
     .length      

      const lastMonthBookings = userListings.flatMap((l) => l.bookings).filter((b) => 
      getLastMonthData(b as Booking)
    ).length 

      const thisMonthGuests = userListings.flatMap((l) => l.bookings).filter((b) =>
      getThisMonthData(b as Booking)
    )  
     .reduce((sum, b) => sum + ((b?.adultsCount ?? 0) + ( b?.childrenCount ?? 0)) , 0)

      const lastMonthGuests = userListings.flatMap((l) => l.bookings).filter((b) => 
      getLastMonthData(b as Booking)
    ).reduce((sum, b) => sum + ((b?.adultsCount ?? 0) + ( b?.childrenCount ?? 0)) , 0)

     const thisMonthBookedListingsCount = userListings.filter((l) =>
      l.bookings?.length !== 0 &&
      getThisMonthData(l as ApiData)
    ).length



    const lastMonthBookedListingsCount = userListings.filter((l) =>
      l.bookings?.length !== 0 &&
      getLastMonthData(l as ApiData)
    ).length

    const thisMonthListingsCount = userListings.filter((l) =>
      getThisMonthData(l as ApiData)
    ).length

    const lastMonthListingsCount = userListings.filter((l) =>
      getLastMonthData(l as ApiData)
    ).length
    

    const thisMonthOccupancyRate = thisMonthListingsCount === 0 
    ? 0 
    : (thisMonthBookedListingsCount / thisMonthListingsCount) * 100

    const lastMonthOccupancyRate = lastMonthListingsCount === 0
    ? 0 
    : (lastMonthBookedListingsCount / lastMonthListingsCount) * 100


    const trendRevenue = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0
    
    const trendBookings = lastMonthBookings > 0 ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0
    
    const trendGuests = lastMonthGuests > 0 
    ? ((thisMonthGuests - lastMonthGuests) / lastMonthGuests) * 100 
    : 0

    const trendOccupancyRate = lastMonthOccupancyRate > 0 && !isNaN(lastMonthOccupancyRate)
    ? ((thisMonthOccupancyRate - lastMonthOccupancyRate) / lastMonthOccupancyRate) * 100 
    : thisMonthOccupancyRate > 0 ? "N/A" : 0
  
    const getTrendStatus = (value:number | 'N/A') : TrendStatus => {
      if(value === "N/A") return "n/a"
      if(value === 0) return "neutral"
      if(value > 0) {
        return "positive"
      } else return "negative"
    }
    const occupancyRateTrendStatus = getTrendStatus(trendOccupancyRate)
    const revenueTrendStatus = getTrendStatus(trendRevenue)
    const bookingTrendStatus = getTrendStatus(trendBookings)
    const guestTrendStatus = getTrendStatus(trendGuests)


const adviceRules = [
  // --- BOOKINGS ---
  {
    condition: totalBookings === 0,
    key: "booking_no_activity"
  },
  {
    condition: totalBookings > 0 && totalBookings < 5,
    key: "booking_low_volume"
  },
  {
    condition: totalBookings >= 5 && totalBookings < 20,
    key: "booking_growing"
  },
  {
    condition: totalBookings >= 20,
    key: "booking_excellent"
  },

  // --- REVENUE ---
  {
    condition: totalRevenue === 0,
    key: "revenue_no_income"
  },
  {
    condition: trendRevenue < 0,
    key: "revenue_declining"
  },
  {
    condition: trendRevenue > 0,
    key: "revenue_increasing"
  },
  {
    condition: thisMonthRevenue > lastMonthRevenue * 1.2,
    key: "revenue_strong_growth"
  },

  // --- GUESTS ---
  {
    condition: totalGuests < 10,
    key: "guests_low_volume"
  },
  {
    condition: trendGuests < 0,
    key: "guests_declining"
  },
  {
    condition: trendGuests > 0,
    key: "guests_increasing"
  },

  // --- RATING ---
  {
    condition: avgRating === 0,
    key: "rating_no_reviews"
  },
  {
    condition: avgRating > 0 && avgRating < 4,
    key: "rating_below_average"
  },
  {
    condition: avgRating >= 4 && avgRating < 4.5,
    key: "rating_good"
  },
  {
    condition: avgRating >= 4.5,
    key: "rating_excellent"
  },

  // --- OCCUPANCY RATE ---
  {
    condition: occupancyRate < 30,
    key: "occupancy_very_low"
  },
  {
    condition: occupancyRate >= 30 && occupancyRate < 60,
    key: "occupancy_moderate"
  },
  {
    condition: occupancyRate >= 60 && occupancyRate < 85,
    key: "occupancy_healthy"
  },
  {
    condition: occupancyRate >= 85,
    key: "occupancy_very_high"
  },

  // --- TREND STATUS ---
  {
    condition: revenueTrendStatus === "negative",
    key: "trend_revenue_negative"
  },
  {
    condition: revenueTrendStatus === "positive",
    key: "trend_revenue_positive"
  },
  {
    condition: bookingTrendStatus === "negative",
    key: "trend_booking_negative"
  },
  {
    condition: bookingTrendStatus === "positive",
    key: "trend_booking_positive"
  },
  {
    condition: occupancyRateTrendStatus === "negative",
    key: "trend_occupancy_negative"
  },
  {
    condition: occupancyRateTrendStatus === "positive",
    key: "trend_occupancy_positive"
  },
  {
    condition: guestTrendStatus === "negative",
    key: "trend_guest_negative"
  },
  {
    condition: guestTrendStatus === "positive",
    key: "trend_guest_positive"
  }
];

const advice = adviceRules
  .filter(rule => rule.condition)
  .map(rule => rule.key);

//randomIndex should be 0 - adviceLength
const randomIndex = Math.floor(Math.random() * advice.length)
const recommendation = advice[randomIndex]
console.log(recommendation, 'rec', randomIndex, 'index')

    return {
      totalRevenue:+(totalRevenue ?? 0),
      totalBookings,
      totalGuests,
      avgRating,
      occupancyRate,
      lastMonthRevenue,
      thisMonthRevenue,
      trendRevenue,
      trendBookings,
      trendGuests,
      trendOccupancyRate,
      revenueTrendStatus,
      bookingTrendStatus,
      occupancyRateTrendStatus,
      guestTrendStatus,
      recommmendation: recommendation
    }
  }

 

  const analyticsData = calculateAnalytics()

  // Revenue trend data (last 12 months)
 
 
 const getCurrency = (user:UserData | null) => constants.currencies.find(
    c => c.code.toLowerCase() === user?.currency
  )



    
   
  


  useEffect(() => {
  const getRevenueTrendDataForEachMonth = () : RevenueTrendData[] => {
  let data : RevenueTrendData[] = [
    { month: 'Jan', revenue: 0, bookings: 0},
    { month: 'Feb', revenue: 0, bookings: 0},
    { month: 'Mar', revenue: 0, bookings: 0},
    { month: 'Apr', revenue: 0, bookings: 0},
    { month: 'May', revenue: 0, bookings: 0},
    { month: 'Jun', revenue: 0, bookings: 0},
    { month: 'Jul', revenue: 0, bookings: 0},
    { month: 'Aug', revenue: 0, bookings: 0},
    { month: 'Sep', revenue: 0, bookings: 0},
    { month: 'Oct', revenue: 0, bookings: 0},
    { month: 'Nov', revenue: 0, bookings: 0},
    { month: 'Dec', revenue: 0, bookings: 0},
  ]
  const userBookings = userListings.flatMap((l) => l.bookings)
  if(userListings.length === 0 || userBookings.length === 0) return data;
  for(let m = 0; m < data?.length; m++) {
  const revenue = userBookings.filter((b) => new Date(b?.createdAt??'').getMonth() === m)
  .reduce((sum, b) => sum + (b?.costPrice?.amount_usd ?? b?.offerPrice?.amount_usd ?? 0), 0)
  data[m].revenue = convertPrice(revenue, "USD", user?.currency?.toUpperCase() as CurrencyCode, currencies ?? []) ?? 0
  data[m].bookings = userBookings.filter((b) => new Date(b?.createdAt??'').getMonth() === m)
  .length
  }
  return data;
  }
  const data = getRevenueTrendDataForEachMonth()
  setTrendRevenueData(data);
  }, [userListings])

  useEffect(() => {

      const calculateGuestsClassificationCount = () => {
      const bookings =  userListings.flatMap((l) => l.bookings).filter(b => b !== undefined)

     const individualBookingsCount = bookings
     .filter((b) => b.adultsCount === 1 && b.childrenCount === 0 ).length

      const coupleBookingsCount = bookings
     .filter((b) => b.adultsCount === 2 && b.childrenCount === 0 ).length

       const familyBookingsCount = bookings
     .filter((b) => b.adultsCount && b.adultsCount >= 1 && b.adultsCount <= 2 && (b.childrenCount ?? 0)  >= 1 ).length

      const groupBookingsCount =  bookings
     .filter((b) => b.adultsCount && b.adultsCount >= 3 ).length

     const total = individualBookingsCount + coupleBookingsCount + familyBookingsCount + groupBookingsCount;
     if(total <= 0) return {
        solo : {value : 0},
        couples : {value : 0},
        families : {value : 0},
        groups : {value : 0},
       }
     const individualBookingsPercentage = (individualBookingsCount / total) * 100 
      const coupleBookingsPercentage = (coupleBookingsCount / total) * 100 
       const familyBookingsPercentage = (familyBookingsCount / total) * 100 
        const groupBookingsPercentage = (groupBookingsCount / total) * 100 


       return {
        solo : {percentage : individualBookingsPercentage, count : individualBookingsCount},
        couples : {percentage : coupleBookingsPercentage, count : coupleBookingsCount },
        families : {percentage : familyBookingsPercentage, count : familyBookingsCount },
        groups : {percentage : groupBookingsPercentage, count : groupBookingsCount },
       }
      }

     const guestInfo = calculateGuestsClassificationCount()
     setGuestDistributionData([ 
        { name : "Solo", value : Math.round(guestInfo.solo.percentage ?? 0),
           color: '#3b82f6', count: guestInfo.solo.count ?? 0 },
        { name: 'Couples', value: Math.round(guestInfo.couples.percentage ?? 0),
           color: '#10b981', count: guestInfo.couples.count ?? 0 },
        { name: 'Families', value: Math.round(guestInfo.families.percentage ?? 0),
           color: '#f59e0b', count : guestInfo.families.count ?? 0},
        { name: 'Groups', value: Math.round(guestInfo.groups.percentage ?? 0),
           color: '#8b5cf6', count: guestInfo.groups.count ?? 0 },
    ])
  }, [userListings])
   


  // Booking by listing data
  const bookingByListingData: BookingByListingData[] = userListings
    .filter(l => (l.bookings?.length ?? 0) > 0)
    .map(l => ({
      name: l.title.split(" ").length > 3 ? l.title.split(" ").slice(0, 3).join(" ") + "..." : l.title,
      bookings: l.bookings?.length ?? 0,
      revenue: (() => {
      const totalRevenue = (l.bookings ?? []).reduce((sum, b) => sum +
       (b?.costPrice?.amount_usd ?? b?.offerPrice?.amount_usd ?? 0), 0);
      const rev = convertPrice(totalRevenue, "USD", user?.currency?.toUpperCase() as CurrencyCode, currencies ?? [])
      return (typeof rev === "number" ? rev : 0.00).toFixed(1)
      
      })()
      // {costPrice : 100, costPrice:200}]
    }))
    .sort((a, b) => b.bookings - a.bookings) // higher first (descending order)
    .slice(0, 6) // limit the array to the first 6 listings

    const maxRevenue = Math.max(...revenueTrendData.map((r) => r.revenue))

    const isMobile = useMediaQuery({maxWidth: 640});
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen mt-24 max-sm:pt-2 ml-72 xl:p-4 
      lg:p-4 p-2 max-2xl:ml-0 overflow-hidden"
    >
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content flex items-center gap-3'>
          <TrendingUp className='text-primary' size={32} />
          {t("dashboard.analyticsTab.title", {ns : "dashboard"})}
        </h1>
        <p className='text-base-content/60 text-xs sm:text-sm mt-1'>
          {t("dashboard.analyticsTab.description", {ns : "dashboard"})}
        </p>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
         {isDashboardLoading ? Array.from({ length: 4 }).map((_, i) => (
      <MetricCardSkeleton key={i} />
        )) : <>
        <MetricCard
          label={t("dashboard.stats.fullLabel.TOTAL_REVENUE", {ns : "dashboard"})}
          unit=""
          value={
            formatCurrency(
            analyticsData.totalRevenue,
            user?.currency?.toUpperCase() as CurrencyCode | undefined
            ) ?? "" as string
          }
          icon={DollarSign}
          trend={{ value: analyticsData.trendRevenue === "N/A"
             ? "N/A" 
             : Math.round(analyticsData.trendRevenue), trendStatus: `${analyticsData.revenueTrendStatus}` }}
          color='success'
        />
        <MetricCard
          label={t("dashboard.stats.fullLabel.TOTAL_BOOKINGS", {ns : "dashboard"})}
          value={analyticsData.totalBookings}
          icon={Calendar}
          trend={{  value: analyticsData.trendBookings === "N/A"
             ? "N/A" 
             : Math.round(analyticsData.trendBookings), trendStatus: `${analyticsData.bookingTrendStatus}` }}
          color='info'
        />
        <MetricCard
          label={t("dashboard.stats.fullLabel.TOTAL_GUESTS", {ns : "dashboard"})}
          value={analyticsData.totalGuests}
          icon={Users}
          trend={{  value: analyticsData.trendGuests === "N/A"
             ? "N/A" 
             : Math.round(analyticsData.trendGuests), trendStatus: `${analyticsData.guestTrendStatus}` }}
          color='warning'
        />
        <MetricCard
          label={t("dashboard.stats.fullLabel.OCCUPANCY_RATE", {ns : "dashboard"})}
          value={analyticsData.occupancyRate}
          unit='%'
          icon={TrendingUp}
          trend={{  value: analyticsData.trendOccupancyRate === "N/A"
             ? "N/A" 
             : Math.round(analyticsData.trendOccupancyRate), trendStatus: `${analyticsData.occupancyRateTrendStatus}`}}
          color='primary'
        />
        </> }

        
        
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>

        {/* Revenue Trend - Full Width */}
        {isDashboardLoading ? <skeletons.RevenueTrendSkeleton/> : (
     <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: 0.1 }}
  className="lg:col-span-2 bg-base-100 rounded-lg border border-base-200 p-3 sm:p-5"
>
  <h2 className="text-sm sm:text-lg font-semibold text-base-content mb-4 truncate">
    {t(`dashboard.analyticsTab.revenueTrend_other`, { ns: "dashboard", months: 12 })}
  </h2>

  <ResponsiveContainer width="100%" height={undefined} aspect={isMobile ? 1.5 : 2.5}>
    <LineChart
      data={revenueTrendData}
      className="focus:outline-none outline-none"
      reverseStackOrder={i18n.dir() === "rtl"}
      margin={{
        left: isMobile ? 0 : 10,
        right: isMobile ? 0 : 10,
        top: 5,
        bottom: 5,
      }}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="var(--fallback-bc,oklch(var(--bc)/0.1))"
      />
      <XAxis
      
        dataKey="month"
        stroke="var(--fallback-bc,oklch(var(--bc)/0.6))"
        reversed={i18n.dir() === "rtl"}
        tick={{ fontSize: isMobile ? 10 : 12, textAnchor: i18n.dir() === "rtl" ? "end" : "middle" }}
        interval={isMobile ? 1 : 0}
      />
      <YAxis
     
        stroke="var(--fallback-bc,oklch(var(--bc)/0.6))"
        orientation={i18n.dir() === "rtl" ? "right" : "left"}
        width={isMobile ? 38 : 55}
       
        tick={{ fontSize: isMobile ? 9 : 12, textAnchor:"end" }}
        tickFormatter={(v) => {
          const symbol = getCurrency(user)?.symbol ?? "";
          const label = constants.prefixCurrencySymbols.includes(symbol)
            ? `${symbol}${v}`
            : `${v}${symbol}`;
          // Truncate long values on mobile
          return  v >= 1000 ? `${symbol}${(v / 1000).toFixed(1)}k` : label;
        }}
      />
      <Tooltip
        formatter={(v) => {
          const symbol = getCurrency(user)?.symbol ?? "";
          return [
            constants.prefixCurrencySymbols.includes(symbol)
              ? `${symbol}${ v ?? 0 >= 1000 ? `${symbol}${(v as any / 1000).toFixed(1)}k` : v}`
              : `${ v ?? 0 >= 1000 ? `${symbol}${(v as any / 1000).toFixed(1)}k` : v} ${symbol}`,
          ];
        }}
        contentStyle={{
          backgroundColor: "var(--fallback-b1,oklch(var(--b1)))",
          border: "1px solid var(--fallback-bc,oklch(var(--bc)/0.2))",
          borderRadius: "8px",
          fontSize: isMobile ? "11px" : "13px",
          direction: i18n.dir(),
        }}
      />
      <Legend wrapperStyle={{ fontSize: isMobile ? "11px" : "13px" }} />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#10b981"
        strokeWidth={2}
        dot={{ fill: "#10b981", r: isMobile ? 2 : 4 }}
        activeDot={{ r: isMobile ? 4 : 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
</motion.div>
        ) }
      

        {/* Guest Distribution */}
        {isDashboardLoading 
        ? <skeletons.GuestDistributionSkeleton/>
        : (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className='bg-base-100 rounded-lg border border-base-200 p-5'
        >
          <h2 className='text-lg font-semibold text-base-content mb-4'>
            {t('dashboard.analyticsTab.guestDistribution', {ns : "dashboard"})}
          </h2>
          {  analyticsData.totalBookings === 0 &&
          <p className='text-sm font-semibold text-base-content/50 mb-4' >
            {t('dashboard.analyticsTab.noBookingsReceivedToAnalyze', {ns : 'dashboard'})}
          </p>
          }
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={guestDistributionData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey='value'
              >
                {guestDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
             
            </PieChart>
          </ResponsiveContainer>
          <div className='space-y-2 mt-4 text-xs'>
            {guestDistributionData.map((item) => (
              <div key={item.name} className='flex items-center justify-between'>
                <span className='flex items-center gap-2'>
                  <div
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: item.color }}
                  />
                  {t(`dashboard.analyticsTab.guestClassification.${item.name.toLocaleLowerCase()}`, {ns : "dashboard"})}
                </span>
                <span className='font-semibold'>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
        ) }
        
      </div>

      {/* Booking by Listing */}
      {isDashboardLoading ? <skeletons.BookingByListingSkeleton/> : (
        analyticsData.totalBookings > 0 &&<motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className='bg-base-100 rounded-lg border border-base-200 p-5 mb-8'
      >
        <h2 className='text-lg font-semibold text-base-content mb-4'>
          
            {t('dashboard.analyticsTab.top', {ns : "dashboard"})}
        </h2>
        <ResponsiveContainer width='100%' height={300} >
          <BarChart data={bookingByListingData} >
            <CartesianGrid strokeDasharray='3 3' stroke='var(--fallback-bc,oklch(var(--bc)/0.1))'  />
            <XAxis dataKey='name' stroke='var(--fallback-bc,oklch(var(--bc)/0.6))' />
            <YAxis tick={{textAnchor: i18n.language === "ar" ? "start" : "end"}}  stroke='var(--fallback-bc,oklch(var(--bc)/0.6))' />
            <Tooltip
              formatter={(value, name) => (name === "revenue" && value)
                ? formatCurrency(+value, user?.currency?.toUpperCase() as CurrencyCode) : value}
              contentStyle={{
                backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))',
                border: '1px solid var(--fallback-bc,oklch(var(--bc)/0.2))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar 
            dataKey="bookings"
            name={t("dashboard.analyticsTab.bookings", {ns : 'dashboard'})}
             fill='#3b82f6' radius={[8, 8, 0, 0]} />
             
            <Bar dataKey="revenue"
               name={t("dashboard.analyticsTab.revenue", {ns : 'dashboard'})}
             fill='#10b981' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      )}
      

      {/* Insights Section */}
     { analyticsData.totalBookings > 0 
     && <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-4'
      >
  
         <InsightCard
          title={t('dashboard.analyticsTab.peak', {ns:"dashboard"})}
           label={t('dashboard.analyticsTab.peakMonth', {
              ns:"dashboard",
              count : revenueTrendData.find(r => r.revenue === maxRevenue)?.bookings,
              month: revenueTrendData.find( r => r.revenue === maxRevenue)?.month
            })}
           icon={TrendingUp}
           color="success"
           isLoading={isDashboardLoading}
           />
        

         <InsightCard
          title={t("dashboard.analyticsTab.BestGuests", {
            ns : "dashboard"
           })}
           label={t('dashboard.analyticsTab.bestGuests', {
              ns:"dashboard",
              guestType : guestDistributionData.find(g => g.value === Math.max(...guestDistributionData
                .map(g => g.value)))?.name,
              percentage : guestDistributionData.find(g => g.value === Math.max(...guestDistributionData
                .map(g => g.value)))?.value + "%"
            })}
           icon={UserStar}
           color="info"
           isLoading={isDashboardLoading}
           />
           

        <InsightCard title={t("dashboard.analyticsTab.Recommendations", {
            ns : "dashboard"
           })}
           label={t(`dashboard.analyticsTab.recommendations.${analyticsData.recommmendation}`, {
            ns : "dashboard"
           })}
           icon={StarIcon}
           color="warning"
           isLoading={isDashboardLoading}
           />

      </motion.div>}
    </motion.div>
  )
}

export default Analytics