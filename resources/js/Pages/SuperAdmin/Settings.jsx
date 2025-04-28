"use client"

import { useState } from "react"
import { Head } from '@inertiajs/react'
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Search,Save, X, Upload, Eye, Palette, Type,
  Image, Sun, Moon, Monitor, Globe, Clock, Settings as SettingsIcon,
  Star, Building2, Mail, Shield, Bell, Database, BedDouble, 
  UtensilsCrossed, CreditCard, Plug, Server
} from "lucide-react"   

export default function Settings({ auth }) {
  const [activeTab, setActiveTab] = useState("appearance")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  
  // Enhanced settings state
  const [settings, setSettings] = useState({
    appearance: {
      theme: {
        mode: "light",
        primaryColor: "#D97706",
        accentColor: "#92400E",
        backgroundColor: "#FFFFFF",
        customCSS: "",
        buttonStyle: "default",
        cardStyle: "default",
        tableStyle: "default",
        formStyle: "default",
        modalStyle: "default",
        enableAnimations: true
      },
      branding: {
        hotelName: "Luxe Hotel & Restaurant",
        logo: "/path/to/logo.png",
        favicon: "/path/to/favicon.ico"
      },
      login: {
        backgroundStyle: "gradient",
        enableTwinklingStars: true,
        enableShootingStars: false,
        loaderSize: "large",
        loaderGlow: true
      },
      fonts: {
        headingFont: "Inter",
        bodyFont: "Inter",
        fontSize: "normal",
        customFonts: []
      }
    },
    email: {
      smtp: {
        host: "",
        port: 587,
        username: "",
        password: "",
        encryption: "tls"
      },
      templates: {
        welcome: { subject: "", body: "" },
        reservation: { subject: "", body: "" },
        invoice: { subject: "", body: "" },
        recovery: { subject: "", body: "" }
      },
      senderName: "",
      senderEmail: ""
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true,
        expiryDays: 90
      },
      twoFactorAuth: {
        enabled: false,
        method: "email",
        backupCodes: 5
      },
      sessionTimeout: 30,
      ipWhitelist: []
    },
    notifications: {
      email: {
        enabled: true,
        events: ["booking", "payment", "review"]
      },
      sms: {
        enabled: false,
        provider: "",
        apiKey: "",
        events: []
      },
      inApp: {
        enabled: true,
        maxAge: 30,
        events: ["all"]
      }
    },
    backup: {
      schedule: "daily",
      retention: 30,
      location: "local",
      cloudProvider: "",
      cloudCredentials: {}
    },
    rooms: {
      categories: [],
      amenities: [],
      pricingRules: {
        seasonal: [],
        occupancy: [],
        length: []
      },
      checkInTime: "14:00",
      checkOutTime: "12:00"
    },
    restaurant: {
      menuCategories: [],
      serviceHours: {
        breakfast: { start: "06:00", end: "10:00" },
        lunch: { start: "11:30", end: "14:30" },
        dinner: { start: "18:00", end: "22:00" }
      },
      tableReservation: {
        enabled: true,
        maxDuration: 120,
        minNotice: 30
      }
    },
    payment: {
      gateways: [],
      currency: "PHP",
      taxRate: 12,
      serviceCharge: 10
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      tripAdvisor: "",
      booking: "",
      expedia: ""
    },
    system: {
      dateFormat: "MMM DD, YYYY",
      timeFormat: "12",
      timezone: "Asia/Manila",
      language: "en",
      maintenance: {
        enabled: false,
        schedule: [],
        message: ""
      },
      cache: {
        enabled: true,
        duration: 3600
      },
      logs: {
        level: "info",
        retention: 30
      },
      performance: {
        imageOptimization: true,
        minifyAssets: true,
        cacheHeaders: true
      }
    }
  })

  // Theme presets remain the same
  const themePresets = [
    {
      id: 1,
      name: "Classic Amber",
      primaryColor: "#D97706",
      accentColor: "#92400E",
      preview: "bg-gradient-to-r from-amber-600 to-amber-800"
    },
    {
      id: 2,
      name: "Royal Purple",
      primaryColor: "#7C3AED",
      accentColor: "#5B21B6",
      preview: "bg-gradient-to-r from-purple-600 to-purple-800"
    },
    {
      id: 3,
      name: "Ocean Blue",
      primaryColor: "#2563EB",
      accentColor: "#1D4ED8",
      preview: "bg-gradient-to-r from-blue-600 to-blue-800"
    },
    {
      id: 4,
      name: "Forest Green",
      primaryColor: "#059669",
      accentColor: "#047857",
      preview: "bg-gradient-to-r from-emerald-600 to-emerald-800"
    }
  ]

  // Get category icon helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case "theme": return <Palette className="h-5 w-5 text-amber-600" />
      case "branding": return <Building2 className="h-5 w-5 text-amber-600" />
      case "login": return <Star className="h-5 w-5 text-amber-600" />
      case "fonts": return <Type className="h-5 w-5 text-amber-600" />
      case "email": return <Mail className="h-5 w-5 text-amber-600" />
      case "security": return <Shield className="h-5 w-5 text-amber-600" />
      case "notifications": return <Bell className="h-5 w-5 text-amber-600" />
      case "backup": return <Database className="h-5 w-5 text-amber-600" />
      case "rooms": return <BedDouble className="h-5 w-5 text-amber-600" />
      case "restaurant": return <UtensilsCrossed className="h-5 w-5 text-amber-600" />
      case "payment": return <CreditCard className="h-5 w-5 text-amber-600" />
      case "integrations": return <Plug className="h-5 w-5 text-amber-600" />
      case "system": return <Server className="h-5 w-5 text-amber-600" />
      default: return <SettingsIcon className="h-5 w-5 text-amber-600" />
    }
  }

  // Handle settings update
  const handleSettingChange = (category, subcategory, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [field]: value
        }
      }
    }))
  }

  // Save settings
  const saveSettings = async () => {
    // TODO: Implement API call to save settings
    setShowPreview(false)
  }

  return (
    <SuperAdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Settings</h2>
      }
    >
      <Head title="Settings" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Settings Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          {[
            { id: "appearance", label: "Appearance" },
            { id: "email", label: "Email" },
            { id: "security", label: "Security" },
            { id: "notifications", label: "Notifications" },
            { id: "backup", label: "Backup" },
            { id: "rooms", label: "Rooms" },
            { id: "restaurant", label: "Restaurant" },
            { id: "payment", label: "Payment" },
            { id: "integrations", label: "Integrations" },
            { id: "system", label: "System" }
          ].map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id 
                  ? "text-amber-600 border-b-2 border-amber-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Email Settings */}
          {activeTab === "email" && (
            <>
              {/* SMTP Settings */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">SMTP Settings</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                      <input
                        type="text"
                        placeholder="smtp.example.com"
                        value={settings.email.smtp.host}
                        onChange={(e) => handleSettingChange("email", "smtp", "host", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                        <input
                          type="number"
                          value={settings.email.smtp.port}
                          onChange={(e) => handleSettingChange("email", "smtp", "port", parseInt(e.target.value))}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                        <select
                          value={settings.email.smtp.encryption}
                          onChange={(e) => handleSettingChange("email", "smtp", "encryption", e.target.value)}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        >
                          <option value="tls">TLS</option>
                          <option value="ssl">SSL</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={settings.email.smtp.username}
                        onChange={(e) => handleSettingChange("email", "smtp", "username", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="username@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={settings.email.smtp.password}
                        onChange={(e) => handleSettingChange("email", "smtp", "password", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Templates */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(settings.email.templates).map(([key, template]) => (
                      <div key={key} className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{key} Email</h4>
                        <input
                          type="text"
                          value={template.subject}
                          onChange={(e) => handleSettingChange("email", "templates", key, { ...template, subject: e.target.value })}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Subject"
                        />
                        <textarea
                          value={template.body}
                          onChange={(e) => handleSettingChange("email", "templates", key, { ...template, body: e.target.value })}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          rows={3}
                          placeholder="Email body"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <>
              {/* Password Policy */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Password Policy</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Length</label>
                      <input
                        type="number"
                        value={settings.security.passwordPolicy.minLength}
                        onChange={(e) => handleSettingChange("security", "passwordPolicy", "minLength", parseInt(e.target.value))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        min={8}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.passwordPolicy.requireUppercase}
                          onChange={(e) => handleSettingChange("security", "passwordPolicy", "requireUppercase", e.target.checked)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Require Uppercase</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.passwordPolicy.requireNumbers}
                          onChange={(e) => handleSettingChange("security", "passwordPolicy", "requireNumbers", e.target.checked)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Require Numbers</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.passwordPolicy.requireSymbols}
                          onChange={(e) => handleSettingChange("security", "passwordPolicy", "requireSymbols", e.target.checked)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Require Symbols</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (Days)</label>
                      <input
                        type="number"
                        value={settings.security.passwordPolicy.expiryDays}
                        onChange={(e) => handleSettingChange("security", "passwordPolicy", "expiryDays", parseInt(e.target.value))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth.enabled}
                        onChange={(e) => handleSettingChange("security", "twoFactorAuth", "enabled", e.target.checked)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Method</label>
                      <select
                        value={settings.security.twoFactorAuth.method}
                        onChange={(e) => handleSettingChange("security", "twoFactorAuth", "method", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        disabled={!settings.security.twoFactorAuth.enabled}
                      >
                        <option value="email">Email</option>
                        <option value="authenticator">Authenticator App</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Backup Codes</label>
                      <input
                        type="number"
                        value={settings.security.twoFactorAuth.backupCodes}
                        onChange={(e) => handleSettingChange("security", "twoFactorAuth", "backupCodes", parseInt(e.target.value))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        min={1}
                        max={10}
                        disabled={!settings.security.twoFactorAuth.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Settings */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Session Settings</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (Minutes)</label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange("security", "sessionTimeout", "", parseInt(e.target.value))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        min={5}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IP Whitelist</label>
                      <div className="space-y-2">
                        {settings.security.ipWhitelist.map((ip, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={ip}
                              onChange={(e) => {
                                const newList = [...settings.security.ipWhitelist]
                                newList[index] = e.target.value
                                handleSettingChange("security", "ipWhitelist", "", newList)
                              }}
                              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                              placeholder="192.168.1.1"
                            />
                            <button
                              onClick={() => {
                                const newList = settings.security.ipWhitelist.filter((_, i) => i !== index)
                                handleSettingChange("security", "ipWhitelist", "", newList)
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newList = [...settings.security.ipWhitelist, ""]
                            handleSettingChange("security", "ipWhitelist", "", newList)
                          }}
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                          + Add IP Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <>
              {/* Email Notifications */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email.enabled}
                        onChange={(e) => handleSettingChange("notifications", "email", "enabled", e.target.checked)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Email Notifications</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notify On:</label>
                      <div className="space-y-2">
                        {["booking", "payment", "review"].map((event) => (
                          <label key={event} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications.email.events.includes(event)}
                              onChange={(e) => {
                                const events = e.target.checked
                                  ? [...settings.notifications.email.events, event]
                                  : settings.notifications.email.events.filter(e => e !== event)
                                handleSettingChange("notifications", "email", "events", events)
                              }}
                              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                              disabled={!settings.notifications.email.enabled}
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{event}s</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">SMS Notifications</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms.enabled}
                        onChange={(e) => handleSettingChange("notifications", "sms", "enabled", e.target.checked)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable SMS Notifications</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMS Provider</label>
                      <select
                        value={settings.notifications.sms.provider}
                        onChange={(e) => handleSettingChange("notifications", "sms", "provider", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        disabled={!settings.notifications.sms.enabled}
                      >
                        <option value="">Select Provider</option>
                        <option value="twilio">Twilio</option>
                        <option value="nexmo">Nexmo</option>
                        <option value="messagebird">MessageBird</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        value={settings.notifications.sms.apiKey}
                        onChange={(e) => handleSettingChange("notifications", "sms", "apiKey", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        disabled={!settings.notifications.sms.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">In-App Notifications</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.inApp.enabled}
                        onChange={(e) => handleSettingChange("notifications", "inApp", "enabled", e.target.checked)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable In-App Notifications</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notification Age (Days)</label>
                      <input
                        type="number"
                        value={settings.notifications.inApp.maxAge}
                        onChange={(e) => handleSettingChange("notifications", "inApp", "maxAge", parseInt(e.target.value))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        min={1}
                        disabled={!settings.notifications.inApp.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Backup Settings */}
          {activeTab === "backup" && (
            <>
              {/* Backup Configuration */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Backup Configuration</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Backup Schedule</label>
                      <select
                        value={settings.backup.schedule}
                        onChange={(e) => handleSettingChange("backup", "schedule", "", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="hourly">Every Hour</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (Days)</label>
                      <input
                        type="number"
                        value={settings.backup.retention}
                        onChange={(e) => handleSettingChange("backup", "retention", "", parseInt(e.target.value))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        min={1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                      <select
                        value={settings.backup.location}
                        onChange={(e) => handleSettingChange("backup", "location", "", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="local">Local Storage</option>
                        <option value="cloud">Cloud Storage</option>
                      </select>
                    </div>

                    {settings.backup.location === "cloud" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cloud Provider</label>
                          <select
                            value={settings.backup.cloudProvider}
                            onChange={(e) => handleSettingChange("backup", "cloudProvider", "", e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          >
                            <option value="">Select Provider</option>
                            <option value="aws">Amazon S3</option>
                            <option value="gcp">Google Cloud Storage</option>
                            <option value="azure">Azure Blob Storage</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Room Settings */}
          {activeTab === "rooms" && (
            <>
              {/* Room Categories */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Room Categories</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {settings.rooms.categories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => {
                            const newCategories = [...settings.rooms.categories]
                            newCategories[index] = e.target.value
                            handleSettingChange("rooms", "categories", "", newCategories)
                          }}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Category name"
                        />
                        <button
                          onClick={() => {
                            const newCategories = settings.rooms.categories.filter((_, i) => i !== index)
                            handleSettingChange("rooms", "categories", "", newCategories)
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newCategories = [...settings.rooms.categories, ""]
                        handleSettingChange("rooms", "categories", "", newCategories)
                      }}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      + Add Category
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Amenities */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Room Amenities</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {settings.rooms.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={amenity}
                          onChange={(e) => {
                            const newAmenities = [...settings.rooms.amenities]
                            newAmenities[index] = e.target.value
                            handleSettingChange("rooms", "amenities", "", newAmenities)
                          }}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Amenity name"
                        />
                        <button
                          onClick={() => {
                            const newAmenities = settings.rooms.amenities.filter((_, i) => i !== index)
                            handleSettingChange("rooms", "amenities", "", newAmenities)
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newAmenities = [...settings.rooms.amenities, ""]
                        handleSettingChange("rooms", "amenities", "", newAmenities)
                      }}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      + Add Amenity
                    </button>
                  </div>
                </div>
              </div>

              {/* Check-in/Check-out Times */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Check-in/Check-out Times</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                      <input
                        type="time"
                        value={settings.rooms.checkInTime}
                        onChange={(e) => handleSettingChange("rooms", "checkInTime", "", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                      <input
                        type="time"
                        value={settings.rooms.checkOutTime}
                        onChange={(e) => handleSettingChange("rooms", "checkOutTime", "", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Theme Settings */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Theme</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Sun className="h-4 w-4" />
                      Light
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Moon className="h-4 w-4" />
                      Dark
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Monitor className="h-4 w-4" />
                      System
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {themePresets.map((preset) => (
                      <button
                        key={preset.id}
                        className={`p-3 rounded-lg border border-gray-200 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all ${preset.preview}`}
                      >
                        <span className="block text-white text-sm font-medium mb-1">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Colors</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Primary</label>
                      <input
                        type="color"
                        value={settings.appearance.theme.primaryColor}
                        className="block w-full h-8 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Accent</label>
                      <input
                        type="color"
                        value={settings.appearance.theme.accentColor}
                        className="block w-full h-8 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Branding Settings */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Branding</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    value={settings.appearance.branding.hotelName}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <Image className="h-4 w-4 text-gray-400" />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      Upload Favicon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Page Settings */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Login Page</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Style</label>
                  <select
                    value={settings.appearance.login.backgroundStyle}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="gradient">Gradient</option>
                    <option value="image">Image</option>
                    <option value="solid">Solid Color</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Effects</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.appearance.login.enableTwinklingStars}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Twinkling Stars</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.appearance.login.enableShootingStars}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Shooting Stars</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loader</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="loaderSize"
                        value="large"
                        checked={settings.appearance.login.loaderSize === "large"}
                        className="border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Large Loader</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.appearance.login.loaderGlow}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Glow Effect</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">System</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select
                    value={settings.system.dateFormat}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="MMM DD, YYYY">Mar 16, 2025</option>
                    <option value="DD/MM/YYYY">16/03/2025</option>
                    <option value="YYYY-MM-DD">2025-03-16</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
                  <select
                    value={settings.system.timeFormat}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="12">12-hour (1:30 PM)</option>
                    <option value="24">24-hour (13:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    value={settings.system.timezone}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (GMT-4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={settings.system.currency}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="PHP">Philippine Peso (₱)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Preview Changes</h3>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Theme Preview</h4>
                  <div className={`h-20 rounded-lg ${themePresets[0].preview}`}></div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Branding Preview</h4>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{settings.appearance.branding.hotelName}</p>
                      <p className="text-sm text-gray-500">Logo & Branding</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg hover:from-amber-700 hover:to-amber-900 transition-colors">
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}