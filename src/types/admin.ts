import type { LucideIcon } from 'lucide-react'

export type AdminRoleId =
  | 'super_admin'
  | 'admin'
  | 'finance_manager'
  | 'support_agent'
  | 'operations_manager'

export type AdminPermission =
  | 'dashboard'
  | 'transactions'
  | 'refunds'
  | 'services'
  | 'users'
  | 'airtime'
  | 'databundle'
  | 'electricity'
  | 'cable'
  /** Transaction & service reports (non–financial analytics) */
  | 'reports'
  /** Financial / revenue analytics — Super Admin only per product spec */
  | 'revenue'
  | 'finance'
  | 'support'
  | 'monitoring'
  | 'admins'
  | 'settings'
  | 'provider_settings'
  | 'notifications'
  | 'profile'

export type RefundStatus = 'Initiated' | 'Processing' | 'Completed' | 'Failed'

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  permission: AdminPermission
  /** Nested items for sidebar accordion (optional) */
  children?: AdminNavItem[]
  /** Omit from sidebar while keeping routes/pages in the app */
  hiddenInNav?: boolean
}

export type TxStatus = 'Successful' | 'Pending' | 'Failed' | 'Refunded'

export type AdminTransactionRow = {
  id: string
  user: string
  userEmail?: string
  userPhone?: string
  serviceType: string
  provider: string
  recipientDetail?: string
  amount: number
  status: TxStatus
  paymentReference?: string
  providerResponse?: string
  failureReason?: string
  date: string
}

export type ServiceStatus = 'Active' | 'Disabled'

export type ServiceConfigRow = {
  id: string
  serviceName: string
  category: 'Airtime' | 'Data Bundle' | 'Electricity' | 'Cable TV'
  status: ServiceStatus
  updatedAt: string
}

export type ProviderRow = {
  id: string
  providerName: string
  category: 'Airtime/Data' | 'Electricity' | 'Cable TV'
  serviceAvailability: 'Available' | 'Unavailable'
}

export type PricingRow = {
  id: string
  serviceType: string
  serviceName: string
  providerName: string
  basePrice: number
  markupPercent: number
  finalPrice: number
}

export type AdminUserRow = {
  id: string
  fullName: string
  email: string
  phone: string
  registeredAt: string
  status: 'Active' | 'Suspended' | 'Restricted'
}

export type RefundRow = {
  id: string
  transactionId: string
  userName: string
  serviceType: 'Airtime' | 'Data Bundle' | 'Electricity Payment' | 'Cable TV Subscription'
  provider: string
  amount: number
  refundStatus: RefundStatus
  refundRequestDate: string
  paystackReference: string
  refundCompletionDate?: string
}

export type ActivityItem = {
  id: string
  title: string
  description: string
  tone: 'success' | 'warning' | 'danger' | 'info'
  time: string
}
