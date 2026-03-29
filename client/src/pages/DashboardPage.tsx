import {motion} from 'framer-motion'
import {  Calendar, CatIcon, ChevronDown, Clock, LayoutGridIcon, MenuIcon, PenBoxIcon, PinIcon, Search, TicketCheck, Tickets, Trash, Users} from 'lucide-react'
import { useListingStore } from '../store/listingStore'
import { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import FallbackCard from '../components/FallbackCard'
import { useTranslation } from 'react-i18next'
import i18n from '../config/reacti18next'
import ToasterCompo from '../components/Toaster'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import { sliceText } from '../utils/sliceText'
import avatar from '../assets/avatar.png'
import type { StatusEnum } from '../types/types'
import StatCard from '../components/StartCard'
import * as helpers from '../utils/helpers'
import { useMessageStore } from '../store/messageStore'
import clsx from 'clsx'
import { useSidebarToggle } from '../hooks/useSidebarToggle'

interface ListingType {
  title : string,
  description : string,
  location : string
  createdAt: string
}

 const DashboardPage = () => {
  const {t} = useTranslation()
  const {getUserListings,userListings, deleteListing, isDashboardLoading,
     isDeleting, updateStatus } = useListingStore()

     const {setSelectedUser} = useMessageStore()

   const [query , setQuery] = useState("")
   const [isSliced, setIsSliced] = useState<{[id:string] : boolean}>({})
   const [isOpen, setIsOpen] = useState(false);
   const [isExpanded, setIsExpanded] = useState<{[key:string] : boolean}>({})
  useEffect(() => {
    getUserListings()
  }, [isDeleting, getUserListings])
  const navigate = useNavigate()
  const fields : (keyof ListingType)[] = ["title", "description", "location", "createdAt"]
  const filteredListings =userListings.filter(listing => (
   fields.some(field => listing[field]?.toLowerCase().includes(query.toLowerCase().trim()))
  ))

  const lang = i18n.language

  const onEdit = (listingId : string | undefined) => {
  if(!listingId) {
  return;
  }
    navigate(`/dashboard/edit/${listingId}`)
  };
  const onDelete = (listingId : string | undefined) => {
  if(!listingId) {
  toast.custom((toast) => (
  <ToasterCompo color="red" msg={t("clientMessages.", {ns:"messages"})} t={toast}/>
  ))
  return;
  }
 setIsOpen(false)
 deleteListing(listingId)
}

 const handleChangeStatus = async(listingId:string|undefined, status : StatusEnum) => {
  if(!listingId) return;
  await updateStatus(listingId, status)
 }

 const {handleSidebarOpen} = useSidebarToggle()

   return (
    <>
     {isOpen && <Modal  onConfirm={onDelete} onShowModal={setIsOpen} titleKey='Modal.deleteListingTitle'
    subtitleKey="Modal.deleteListingMsg"
    />}
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="relative min-h-screen mt-24 max-sm:pt-2 ml-72 xl:p-4 lg:p-4 p-2 max-2xl:ml-0 overflow-x-hidden"
>
  {/* Search Bar */}
  <div className="flex justify-between gap-2 select-none">
     <div className="relative mb-8 w-full">
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      type="text"
     className={`input input-bordered rounded-xl w-full text-sm
      ${lang === "ar" ? "pr-11" : "pl-11"}
      focus:outline-none focus:border-base-content/40
      placeholder:text-base-content/30`}
      
      placeholder={t("placeholders.search", { ns: "common" })}
    />
    <Search
      className={`absolute top-1/2 -translate-y-1/2 
        ${lang === 'ar' ? "right-2" : "left-2"} mx-2 size-[16px] text-base-content/40`}
    />
  </div>

  <button
  onClick={handleSidebarOpen}
  className={clsx("border border-base-content/10 btn 2xl:hidden",
  "items-center gap-2 bg-base-300/50 rounded right-0 px-4 shadow-sm",
  lang === "ar" && "flex-row-reverse",
  "hover:scale-105 transition-all duration-200 active:scale-95 text-base-content")}>
 <MenuIcon/> {t("buttons.menu", {ns : "common"})}
  </button>
  </div>
 

  {/* Overview Header */}
  <div className='mb-6 sm:mb-8'>
    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content'>
     {t("dashboard.title", { ns: "dashboard" })}
    </h1>
    <p className='text-base-content/60 text-xs sm:text-sm mt-1'>
     {t("dashboard.description", { ns: "dashboard" })}
    </p>
  </div>

  {/* Stats Grid */}
  <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8'>
    {/* Total Listings Card */}
    <StatCard
      icon={<LayoutGridIcon size={18} />}
      label={t("dashboard.stats.shortLabel.TOTAL_LISTINGS", {ns : "dashboard"})} 
      labelFull={t("dashboard.stats.fullLabel.TOTAL_LISTINGS", {ns : "dashboard"})} 
      value={userListings.length}
      color='primary'
    />

    {/* Booked Listings Card */}
    <StatCard
      icon={<TicketCheck size={18} />}
      label={t("dashboard.stats.shortLabel.BOOKED_LISTINGS", {ns : "dashboard"})} 
      labelFull={t("dashboard.stats.fullLabel.BOOKED_LISTINGS", {ns : "dashboard"})} 
      value={userListings.filter(l => (l.bookings?.length ?? 0) > 0).length}
      color='success'
    />

    {/* Total Bookings Card */}
    <StatCard
      icon={<Tickets size={18} />}
      label={t("dashboard.stats.shortLabel.TOTAL_BOOKINGS", {ns : "dashboard"})} 
      labelFull={t("dashboard.stats.fullLabel.TOTAL_BOOKINGS", {ns : "dashboard"})} 
      value={userListings.reduce((sum, l) => sum + (l.bookings?.length ?? 0), 0)}
      color='info'
    />

    {/* Recently Added Card */}
    <StatCard
      icon={<Clock size={18} />}
      label={t("dashboard.stats.shortLabel.ADDED_THIS_WEEK", {ns : "dashboard"})} 
      labelFull={t("dashboard.stats.fullLabel.ADDED_THIS_WEEK", {ns : "dashboard"})} 
      value={userListings.filter(l =>
        new Date(l.createdAt ?? "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length}
      color='warning'
    />
  </div>

  {/* Listings Section */}
  {filteredListings.length === 0 && !isDashboardLoading ? (
    <FallbackCard
      icon={query ? "search" : "info"}
      className='!mt-4'
      header={
        query
          ? t("fallbackMessages.nothingFound", { ns: "messages" })
          : t("fallbackMessages.noListingYet", { ns: "messages" })
      }
      subtext={
        query
          ? t("fallbackMessages.noListingMatchSearch", { ns: "messages" })
          : t("fallbackMessages.plzPostListing", { ns: "messages" })
      }
    />
  ) : (
    <div className='space-y-4'>
      {userListings.map((listing) => (
        <div
          key={listing._id}
          className='bg-base-100 rounded-lg shadow-md hover:shadow-lg border border-base-200 
          hover:border-primary/30 transition-all duration-200 group overflow-hidden'
        >
          {/* Main Card Content */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5'>

            {/* Image Section */}
            <figure className='w-full sm:w-32 lg:w-1/4 flex-shrink-0'>
              <div className='aspect-square sm:aspect-auto sm:h-32 lg:h-[200px] overflow-hidden rounded-lg'>
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
              </div>
            </figure>

            {/* Content Section */}
            <div className='flex-1 flex flex-col justify-between min-w-0'>
              {/* Title and Price */}
              <div className='space-y-2 sm:space-y-3'>
                <h3 className='text-base sm:text-lg lg:text-xl font-semibold text-base-content line-clamp-2'>
                  {listing.title}
                </h3>

                {/* Description */}
                <p className='text-xs sm:text-sm text-base-content/70 line-clamp-2 sm:line-clamp-3'>
                  {sliceText({
                    text: listing.description,
                    threshold: 100,
                    start: 0,
                    end: isSliced[listing._id as string] ? undefined : 50,
                    splitAt: " ",
                    joinAt: " ",
                    extra: isSliced[listing._id as string] ? " " : "..."
                  })}
                </p>

                {listing.description.split(" ").length > 100 && (
                  <button
                    onClick={() =>
                      setIsSliced((prev) => ({
                        ...prev,
                        [listing._id as string]: !prev[listing._id as string]
                      }))
                    }
                    className="text-primary/80 text-xs sm:text-sm font-semibold
                    hover:text-primary transition-colors duration-200"
                  >
                    {isSliced[listing._id as string]
                      ? t("buttons.less", { ns: "common" })
                      : t("buttons.readMore", { ns: "common" })}
                  </button>
                )}

                <p className='text-xl sm:text-2xl lg:text-3xl font-bold text-primary'>
                  ${listing.price?.amount_local?.toLocaleString()}
                </p>
              </div>

              {/* More Info Button */}
              <button
                onClick={() =>
                  setIsExpanded((prev) => ({
                    ...prev,
                    [listing._id ?? ""]: !prev[listing._id ?? ""]
                  }))
                }
                className='flex items-center gap-2 text-xs sm:text-sm text-base-content/70 hover:text-base-content 
                transition-colors duration-150 w-fit mt-2'
              >
                <div className='bg-primary rounded-full p-1 text-primary-content group-hover:scale-110 
                transition-transform duration-150'>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isExpanded[listing._id ?? ""] ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </div>
                <span className='font-medium'>
                {t(`dashboard.bookings${listing.bookings?.length === 1 ? "_one" : "_other"}`, 
                  {ns : "dashboard", count : listing.bookings?.length})} 
                </span>
              </button>
            </div>

            {/* Actions Section */}
            <div className='flex sm:flex-col justify-between gap-2 sm:gap-3 sm:items-end'>

              {/* Status Toggle */}
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <span className='text-xs font-medium text-base-content/60 hidden sm:inline'>
                  {t("dashboard.active", {ns : "dashboard"})}
                </span>
                <input
                  type='checkbox'
                  checked={listing.status === "active" ? true : false}
                  onChange={() => handleChangeStatus(listing?._id, listing.status)}
                  className='toggle toggle-xs sm:toggle-sm toggle-primary'
                  defaultChecked
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  onClick={() => onEdit(listing?._id)}
                  className='p-2 sm:p-2.5 bg-base-content/5 rounded-full hover:bg-primary/10 
                  border border-transparent hover:border-primary/30 text-base-content/70 hover:text-primary 
                  transition-all duration-200 tooltip'
                  data-tip={t("dashboard.actions.edit", {ns : "dashboard"})} 
                >
                  <PenBoxIcon size={16} className='sm:size-[18px]' />
                </button>

                <button
                  onClick={() => setIsOpen(prev => !prev)}
                  className='p-2 sm:p-2.5 bg-base-content/5 hover:bg-error/10 
                  border border-transparent hover:border-error/30 text-base-content/70 hover:text-error 
                  transition-all duration-200 tooltip rounded-full'
                  data-tip={t("dashboard.actions.delete", {ns : "dashboard"})}
                >
                  <Trash size={16} className='sm:size-[18px]' />
                </button>
              </div>

              {/* Metadata - Visible on sm+ */}
              <div className='hidden sm:flex sm:flex-col gap-1.5 sm:gap-2 sm:text-right text-xs sm:text-sm text-base-content/60 sm:w-full'>
                <div className='flex items-center gap-1.5 sm:justify-end'>
                  <PinIcon className='text-error flex-shrink-0' size={14} />
                  <span className='line-clamp-1'>{listing.location}</span>
                </div>
                <div className='flex items-center gap-1.5 sm:justify-end'>
                  <Calendar className='text-primary flex-shrink-0' size={14} />
                  <span>{new Date(listing.createdAt ?? '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Metadata - Visible only on mobile */}
          <div className='sm:hidden border-t border-base-200 px-3 py-2 flex gap-3 text-xs text-base-content/60'>
            <div className='flex items-center gap-1.5'>
              <PinIcon className='text-error flex-shrink-0' size={14} />
              <span className='line-clamp-1'>{listing.location}</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Calendar className='text-primary flex-shrink-0' size={14} />
              <span>{new Date(listing.createdAt ?? '').toLocaleDateString()}</span>
            </div>
          </div>

          {/* Expanded Bookings Section */}
          {isExpanded[listing._id ?? ""] && (
            <div className='border-t border-base-200 bg-base-200/40 p-3 sm:p-4 lg:p-6 space-y-4'>
              {/* Bookings Header */}
              <h3 className='text-xs sm:text-sm font-semibold text-base-content/80 uppercase tracking-wide'>
               {t(`dashboard.analyticsTab.bookings`,
                 { ns: "dashboard", count: listing.bookings?.length })} ({listing.bookings?.length ?? 0})
              </h3>

              {/* Bookings List */}
              {listing.bookings && listing.bookings.length > 0 ? (
                <div className='space-y-2 sm:space-y-3'>
                  {listing.bookings.map((booking) => (
                    <div
                      key={booking?._id}
                      className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-base-100 rounded-lg border border-base-200 
                      hover:border-primary/20 hover:bg-base-100/80 transition-all duration-150 group'
                    >
                      {/* Avatar */}
                      <div
                        onClick={() => {
                          navigate(`/profile/${booking?.userId}`)
                        }}
                        className='cursor-pointer flex-shrink-0 size-12 sm:size-14 rounded-full overflow-hidden 
                        shadow-md ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-200'
                      >
                        <img
                          src={booking?.profilePicture || avatar}
                          onError={(e) => e.currentTarget.src = avatar}
                          alt={booking?.firstName}
                          className='h-full w-full object-cover'
                        />
                      </div>

                      {/* Guest Info */}
                      <div className='flex-1 min-w-0'>
                        <h2 className='font-semibold text-base-content text-xs sm:text-sm lg:text-base truncate'>
                          {(booking)?.firstName}
                        </h2>
                        <p className='text-xs text-base-content/60'>
                          {booking?.role}
                        </p>
                      </div>

                      {/* Guest Count - Visible on all */}
                     { !booking.offerPrice &&
                      <div className='flex items-center gap-1.5 text-xs sm:text-sm text-base-content/70'>
                        <Users size={16} />
                        <span className='font-medium'>
                          {(booking?.adultsCount ?? 0) + (booking?.childrenCount ?? 0)}
                        </span>
                        {(booking?.petsCount ?? 0) > 0 && (
                          <>
                            <span className='text-base-content/40'>•</span>
                            <CatIcon size={14} />
                            <span>{booking?.petsCount}</span>
                          </>
                        )}
                      </div>
                      }

                      {/* Dates - Hidden on mobile */}
                      <div className='hidden sm:flex flex-col items-center text-xs lg:text-sm text-base-content/70'>
                        <span className='font-medium'>
                          {new Date(booking?.createdAt as string).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Contact Button */}
                      <button
                        onClick={() =>
                          helpers.handleNavigation({
                            listingUser: {
                              firstName: booking?.firstName ?? "Anonymous",
                              lastName: booking?.lastName ?? "Anonymous",
                              _id: booking?.userId,
                              profilePic: booking?.profilePicture
                            },
                            navigate,
                            setSelectedUser
                          })
                        }
                        className='flex-shrink-0 btn btn-sm lg:btn-md btn-outline rounded 
                        border-info text-info hover:bg-info hover:border-info hover:text-info-content 
                        transition-all duration-200 active:scale-95'
                      >
                        {t("dashboard.contact", {ns : "dashboard"})}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-4 sm:py-8 text-center text-base-content/60'>
                  <p className='text-xs sm:text-sm'>{t("dashboard.noBookings", { ns: "dashboard" })}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</motion.div>
    </>
    
   )
 }
 
 export default DashboardPage
 