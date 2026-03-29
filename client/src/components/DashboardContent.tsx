import { useTranslation } from "react-i18next"
import UserProfile from "./UserProfile"
import { useAuthStore } from "../store/authStore"
import { RiDashboard2Fill } from "react-icons/ri"
import { BarChart3, Calendar, Settings, LogOut, X} from "lucide-react"
import clsx from "clsx"
import i18n from "../config/reacti18next"
import { useLocation, useNavigate } from "react-router-dom"
import { useSidebarToggle } from "../hooks/useSidebarToggle"

const DashboardSidebar = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const lang = i18n.language
  const location = useLocation()
  const navigate = useNavigate()
  const {setIsOpen} = useSidebarToggle()

  const navItems = [
    {
      id: 'overview',
      label: t("sidebar.overview", { ns: "sidebar" }),
      icon: RiDashboard2Fill,
      path: '/dashboard',
      description: t("sidebar.overviewDesc", { ns: "sidebar" })
    },
    {
      id: 'bookings',
      label: t("sidebar.bookings", { ns: "sidebar" }),
      icon: Calendar,
      path: '/dashboard/bookings',
      description: t("sidebar.bookingsDesc", { ns: "sidebar" })
    },
    {
      id: 'analytics',
      label: t("sidebar.analytics", { ns: "sidebar" }),
      icon: BarChart3,
      path: '/dashboard/analytics',
      description: t("sidebar.analyticsDesc", { ns: "sidebar" })
    },
    {
      id: 'settings',
      label: t("sidebar.settings", { ns: "sidebar" }),
      icon: Settings,
      path: '/dashboard/settings',
      description: t("sidebar.settingsDesc", { ns: "sidebar" })
    },
  ]

  const isActive = (path:string) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      {false && (
        <div
          className='fixed inset-0 bg-black/50 lg:hidden z-30'
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
        {/* Header */}
        <div className='p-5 border-b border-base-200'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold text-base-content flex items-center gap-2'>
              <RiDashboard2Fill className='text-primary' size={24} />
              {t("sidebar.dashboard", { ns: "sidebar" })}
            </h1>
            <button
              className='lg:hidden btn btn-ghost btn-sm'
              onClick={() => {setIsOpen(false)}}
            >
              <X size={20} />
            </button>
          </div>
          <p className='text-xs text-base-content/60 mt-1'>
            {t("sidebar.manageListings", { ns: "sidebar" })}
          </p>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto p-4 space-y-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <button
              disabled={item.id === "bookings" || item.id === "settings"}
                key={item.id}
                onClick={() => {
                  
                  navigate(item.path)
                }}
                className={clsx(
                  "disabled:opacity-20 disabled:cursor-default",
                  'w-full gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'text-sm font-medium group',
                  lang === "ar" ? "flex flex-reverse text-right" : "flex items-center text-left",
                  active
                    ? 'bg-primary text-primary-content shadow-md'
                    : 'text-base-content/70 hover:bg-base-200/50 hover:text-base-content'
                )}
              >
                <Icon
                  size={20}
                  className={clsx(
                    'flex-shrink-0 transition-transform group-hover:scale-110',
                    active && 'text-primary-content'
                  )}
                />
                <div className='flex-1'>
                  <p>{item.label}</p>
                  <p className='text-xs opacity-70 hidden sm:block'>
                    {item.description}
                  </p>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Divider */}
        <div className='border-t border-base-200' />

        {/* User Profile Section */}
        <div className='p-2 space-y-3 border-t border-base-200'>
          <UserProfile user={user} />

          {/* Logout Button */}
          <button
            onClick={() => {
              logout()
              navigate('/')
              {}
            }}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-lg 
            text-sm font-medium text-error hover:bg-error/10 transition-all duration-200'
          >
            <LogOut size={18} />
            <span>{t("sidebar.logout", { ns: "sidebar" })}</span>
          </button>
        </div>
     

      {/* Mobile Toggle Button
      <button 
        className='fixed bottom-6 right-6 btn btn-circle mt-24 btn-primary shadow-lg z-20'
        onClick={() => {}}
      >
        
        <Menu size={24} />
      </button> */}
  
    </>
  )
}

export default DashboardSidebar