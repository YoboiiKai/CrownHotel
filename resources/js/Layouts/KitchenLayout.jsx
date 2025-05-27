"use client"

import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  Coffee,
  Utensils,
  Settings,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  BarChart4,
  Bed,
  Key,
  CreditCard,
  Package,
  MessageSquare,
  Crown,
  Shield,
} from "lucide-react"
import { usePage, Link } from "@inertiajs/react"

// Custom Link component to simulate Inertia.js Link
const CustomLink = ({ href, className, children, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault()
    if (onClick) onClick()
    // Navigate to the href
    window.location.href = href
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}

export default function KitchenLayout({ children }) {
  const { auth } = usePage().props
  const user = auth.user
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(() => {
    // Initialize from localStorage or default to "dashboard"
    return localStorage.getItem('activeMenuItem') || "dashboard"
  })
  const [openSubmenu, setOpenSubmenu] = useState(() => {
    // Initialize from localStorage or default to null
    return localStorage.getItem('openSubmenu') || null
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [url, setUrl] = useState(() => {
    // Initialize from current path or default to "/dashboard"
    return window.location.pathname || "/dashboard"
  })
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  
  const openLogoutModal = () => setShowLogoutModal(true)
  const closeLogoutModal = () => setShowLogoutModal(false)
  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      setIsTablet(width >= 640 && width < 1024)
      setIsDesktop(width >= 1024)

      if (width >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    const setActiveMenuFromUrl = () => {
      const currentPath = window.location.pathname
      const allMenus = [...menuItems, ...serviceItems, ...managementItems]
      
      // Check for exact path match in submenu items first
      let foundExactMatch = false
      allMenus.forEach((item) => {
        if (item.submenu) {
          const activeSubItem = item.submenu.find((subItem) => currentPath === subItem.path)
          if (activeSubItem) {
            setActiveItem(item.id)
            setOpenSubmenu(item.id)
            localStorage.setItem('activeMenuItem', item.id)
            localStorage.setItem('openSubmenu', item.id)
            foundExactMatch = true
          }
        }
      })

      // If no exact match found, check for parent menu match
      if (!foundExactMatch) {
        const parentMenu = allMenus.find((item) => 
          item.path && currentPath.startsWith(item.path) && item.path !== ""
        )
        if (parentMenu) {
          setActiveItem(parentMenu.id)
          setOpenSubmenu(parentMenu.id)
          localStorage.setItem('activeMenuItem', parentMenu.id)
          localStorage.setItem('openSubmenu', parentMenu.id)
        }
      }
    }

    setActiveMenuFromUrl()

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleSubmenu = (id) => {
    if (openSubmenu === id) {
      setOpenSubmenu(null)
      localStorage.setItem('openSubmenu', null)
    } else {
      setOpenSubmenu(id)
      localStorage.setItem('openSubmenu', id)
    }
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      path: "/dashboard",
      id: "dashboard",
    },
    {
      name: "Orders",
      icon: <Utensils size={20} />,
      path: "/kitchen/orders",
      id: "orders",
      submenu: [
        { name: "New Orders", path: "/kitchen/orders/new" },
        { name: "In Progress", path: "/kitchen/orders/in-progress" },
        { name: "Completed", path: "/kitchen/orders/completed" },
        { name: "Order History", path: "/kitchen/orders/history" },
      ],
    },
    {
      name: "Menu",
      icon: <Coffee size={20} />,
      path: "/kitchen/menu",
      id: "menu",
      submenu: [
        { name: "Breakfast", path: "/kitchen/menu/breakfast" },
        { name: "Lunch", path: "/kitchen/menu/lunch" },
        { name: "Dinner", path: "/kitchen/menu/dinner" },
        { name: "Specials", path: "/kitchen/menu/specials" },
        { name: "Beverages", path: "/kitchen/menu/beverages" },
      ],
    },
    {
      name: "Inventory",
      icon: <Package size={20} />,
      path: "/kitchen/inventory",
      id: "inventory",
      submenu: [
        { name: "Ingredients", path: "/kitchen/inventory/ingredients" },
        { name: "Low Stock", path: "/kitchen/inventory/low-stock" },
        { name: "Usage Reports", path: "/kitchen/inventory/usage" },
        { name: "Request Supplies", path: "/kitchen/inventory/request" },
      ],
    },
  ]

  const serviceItems = [
    {
      name: "Special Requests",
      icon: <MessageSquare size={20} />,
      path: "/kitchen/special-requests",
      id: "special-requests",
      submenu: [
        { name: "Dietary Restrictions", path: "/kitchen/special-requests/dietary" },
        { name: "Custom Orders", path: "/kitchen/special-requests/custom" },
        { name: "VIP Guests", path: "/kitchen/special-requests/vip" },
      ],
    },
    {
      name: "Food Safety",
      icon: <Shield size={20} />,
      path: "/kitchen/food-safety",
      id: "food-safety",
      submenu: [
        { name: "Temperature Logs", path: "/kitchen/food-safety/temperature" },
        { name: "Cleaning Schedule", path: "/kitchen/food-safety/cleaning" },
        { name: "Inspection Reports", path: "/kitchen/food-safety/inspections" },
      ],
    },
  ]

  const managementItems = [
    {
      name: "Reports",
      icon: <BarChart4 size={20} />,
      path: "/kitchen/reports",
      id: "reports",
      submenu: [
        { name: "Daily Production", path: "/kitchen/reports/production" },
        { name: "Popular Items", path: "/kitchen/reports/popular" },
        { name: "Waste Management", path: "/kitchen/reports/waste" },
        { name: "Staff Performance", path: "/kitchen/reports/staff" },
      ],
    },
    {
      name: "Staff",
      icon: <Users size={20} />,
      path: "/kitchen/staff",
      id: "staff",
      submenu: [
        { name: "Schedule", path: "/kitchen/staff/schedule" },
        { name: "Assignments", path: "/kitchen/staff/assignments" },
      ],
    },
  ]
  const isSubmenuItemActive = (path) => {
    return url === path
  }

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <div key={item.id}>
        {item.submenu ? (
          <div className="mb-1">
            <button
              onClick={() => toggleSubmenu(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                activeItem === item.id
                  ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md"
                  : "text-white hover:bg-[#7C5E42]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`${activeItem === item.id ? "text-white" : "text-[#DEB887] group-hover:text-white"}`}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${openSubmenu === item.id ? "rotate-180" : ""}`}
              />
            </button>
            {openSubmenu === item.id && (
              <div className="mt-1 ml-4 pl-4 border-l-2 border-[#A67C52]">
                {item.submenu.map((subItem) => (
                  <CustomLink
                    key={subItem.name}
                    href={subItem.path}
                    className={`block rounded-lg px-3 py-2 text-sm hover:bg-[#7C5E42] ${
                      url === subItem.path ? "font-medium text-[#DEB887]" : "text-white"
                    }`}
                    onClick={() => {
                      setActiveItem(item.id)
                      setOpenSubmenu(item.id)
                      setUrl(subItem.path)
                      // Store active state in localStorage
                      localStorage.setItem('activeMenuItem', item.id)
                      localStorage.setItem('openSubmenu', item.id)
                    }}
                  >
                    {subItem.name}
                  </CustomLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <CustomLink
            href={item.path}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
              activeItem === item.id
                ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md"
                : "text-white hover:bg-[#7C5E42]"
            }`}
            onClick={() => {
              setActiveItem(item.id)
              setUrl(item.path)
              // Store active state in localStorage
              localStorage.setItem('activeMenuItem', item.id)
              localStorage.setItem('openSubmenu', null)
            }}
          >
            <div className={`${activeItem === item.id ? "text-white" : "text-[#DEB887] group-hover:text-white"}`}>
              {item.icon}
            </div>
            <span className="font-medium">{item.name}</span>
          </CustomLink>
        )}
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        /* Scrollbar styles for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #A67C52, #8B5A2B);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7C5E42, #5D3A1F);
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #A67C52 rgba(255, 255, 255, 0.4);
        }
        
        /* For touch devices */
        @media (hover: none) {
          ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
        }

        /* Responsive typography */
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
        }
        
        /* Prevent content overflow */
        .overflow-wrap-anywhere {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      `}</style>

      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search</h2>
            <button 
              onClick={toggleMobileSearch}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#DEB887]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-[#5D3A1F] bg-[#8B5A2B]/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#DEB887] focus:border-[#A67C52] focus:bg-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52] transition-all"
              autoFocus
            />
          </div>
        </div>
      )}

      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-30 px-2 py-2 sm:px-4 sm:py-3 lg:px-8 lg:py-5">
        <div className="mx-auto flex items-center justify-between rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-3 py-2 sm:px-4 sm:py-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-[#5D3A1F]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSidebar}
              className="rounded-full p-1.5 sm:p-2 text-white hover:bg-[#7C5E42] transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={isMobile ? 18 : 20} className="text-white" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex">
                <div className="absolute inset-0 rounded-xl bg-[#6B4226] blur-[6px] opacity-20"></div>
                <div className="relative flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52] to-[#6B4226] text-white shadow-lg">
                  <Crown size={isMobile ? 14 : 20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold text-white leading-tight font-serif">CROWN of the ORIENT</span>
                <span className="hidden sm:inline-block text-xs text-[#DEB887] font-medium">KITCHEN PORTAL</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative max-w-md flex-1 mx-4 lg:mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#DEB887]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border border-[#5D3A1F] bg-[#8B5A2B]/50 py-2 sm:py-2.5 pl-11 pr-4 text-sm text-white placeholder-[#DEB887] focus:border-[#A67C52] focus:bg-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <button 
              className="md:hidden rounded-full p-1.5 text-white hover:bg-[#7C5E42] hover:text-white transition-colors"
              onClick={toggleMobileSearch}
            >
              <Search size={isMobile ? 18 : 20} className="text-white" />
            </button>
            
            <button className="relative rounded-full p-1.5 sm:p-2.5 text-white hover:bg-[#7C5E42] hover:text-[#DEB887] transition-colors">
              <Bell size={isMobile ? 18 : 20} />
              <span className="absolute right-0.5 top-0.5 sm:right-1.5 sm:top-1.5 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-[8px] sm:text-[10px] font-bold text-white shadow-sm">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 md:gap-3 rounded-full border border-[#5D3A1F] bg-[#8B5A2B]/60 px-2 py-1 sm:px-3 sm:py-1.5 hover:border-[#7C5E42] hover:shadow-md transition-all cursor-pointer" onClick={openLogoutModal}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#6B4226] blur-[5px] opacity-20"></div>
                <div className="relative h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-[#A67C52] to-[#6B4226] flex items-center justify-center text-white shadow-md">
                  <User size={isMobile ? 14 : 16} />
                </div>
              </div>
              <div className="hidden md:block pr-1">
                <p className="text-sm font-medium text-white truncate max-w-[120px] lg:max-w-[180px]">{user?.name || "User"}</p>
                <p className="text-xs text-[#DEB887]">{user?.role || "Hotel Staff"}</p>
              </div>
              <ChevronDown size={16} className="text-[#DEB887]" />
            </div>
          </div>
        </div>
      </header>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[85%] xs:w-[75%] sm:w-72 flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:left-8 lg:top-28 lg:bottom-8 lg:h-auto`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#8B5A2B] to-[#6B4226] border border-[#5D3A1F] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex h-14 sm:h-16 items-center justify-between border-b border-[#5D3A1F] px-4 sm:px-6 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-[#6B4226] blur-[5px] opacity-20"></div>
                <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A67C52] to-[#6B4226] text-white shadow-sm">
                  <Crown size={16} />
                </div>
              </div>
              <span className="text-base sm:text-lg font-bold text-white">Kitchen Portal</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="rounded-full p-1.5 text-white hover:bg-[#7C5E42] transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="custom-scrollbar flex-1 overflow-auto p-3 sm:p-6">
            <div className="mb-5 sm:mb-8">
              <h2 className="px-3 mb-2 sm:mb-3 text-xs font-semibold uppercase tracking-wider text-[#DEB887]">
                Main Menu
              </h2>
              <nav className="space-y-1 sm:space-y-1.5">{renderMenuItems(menuItems)}</nav>
            </div>

            <div className="mb-5 sm:mb-8">
              <h2 className="px-3 mb-2 sm:mb-3 text-xs font-semibold uppercase tracking-wider text-[#DEB887]">
                Services
              </h2>
              <nav className="space-y-1 sm:space-y-1.5">{renderMenuItems(serviceItems)}</nav>
            </div>

            {managementItems.length > 0 && (
              <div className="mb-5 sm:mb-8">
                <h2 className="px-3 mb-2 sm:mb-3 text-xs font-semibold uppercase tracking-wider text-[#DEB887]">
                  Management
                </h2>
                <nav className="space-y-1 sm:space-y-1.5">{renderMenuItems(managementItems)}</nav>
              </div>
            )}
          </div>
          <div className="border-t border-[#5D3A1F] p-3 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-[#6B4226] blur-[5px] opacity-20"></div>
                <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#A67C52] to-[#6B4226] flex items-center justify-center text-white shadow-md">
                  <User size={isMobile ? 16 : 20} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:font-medium text-white truncate">{user?.name || "User"}</p>
                <p className="text-xs text-[#DEB887]">{user?.role || "Hotel Staff"}</p>
              </div>
              <button 
                onClick={openLogoutModal}
                className="rounded-full p-1.5 sm:p-2 text-[#DEB887] hover:bg-[#7C5E42] hover:text-white transition-colors"
              >
                <LogOut size={isMobile ? 16 : 18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      <main className="pt-16 sm:pt-20 lg:pt-32 px-2 sm:px-4 lg:pl-80 lg:px-8 pb-4 sm:pb-6 lg:pb-8 transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-[90%] sm:max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52]/20 to-[#8B5A2B]/20">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-[#6B4226] blur-[5px] opacity-20"></div>
                  <div className="relative h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-gradient-to-br from-[#A67C52] to-[#6B4226] flex items-center justify-center text-white shadow-md">
                    <User size={isMobile ? 20 : 24} />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sign Out</h3>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to sign out of your account?
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeLogoutModal}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20"
              >
                Cancel
              </button>
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="flex-1 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
