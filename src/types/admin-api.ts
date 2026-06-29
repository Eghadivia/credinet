/** Prisma `TxStatus` */
export type ApiTxStatus =
  | 'INITIATED'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'PENDING'
  | 'RETRY'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | string

/** Prisma `PaymentStatus` */
export type ApiPaymentStatus = 'PENDING' | 'PAID' | string

/** Prisma `ServiceType` — extend as your schema grows */
export type ApiServiceType =
  | 'AIRTIME'
  | 'DATA'
  | 'ELECTRICITY'
  | 'CABLE'
  | 'DATA_BUNDLE'
  | string

export type ApiTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'PENDING' | string

export type ApiUserRole = 'ADMIN' | 'SUPER_ADMIN' | 'USER' | string

/** Mirrors Prisma `UserStatus` / Nest query + body enums */
export type ApiUserStatus = 'ACTIVE' | 'SUSPENDED' | 'RESTRICTED'

export type ApiUtilityProvider = 'TOPUPBOX' | 'VTUGATE'

export type ApiProviderSettings = {
  provider: ApiUtilityProvider
  updatedAt?: string
}

export type ApiAdminUser = {
  id?: string
  userId?: string
  uuid?: string
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
  status?: ApiUserStatus | string
}

export type ApiAdminUserListMeta = {
  total: number
  page: number
  limit: number
  totalPages?: number
}

export type ApiAdminUserListPayload = {
  users?: ApiAdminUser[]
  items?: ApiAdminUser[]
  data?: ApiAdminUser[]
  meta?: ApiAdminUserListMeta
  total?: number
  page?: number
  limit?: number
}

export type AdminUserListQuery = {
  status?: ApiUserStatus
  search?: string
  page?: number
  limit?: number
  sort?: 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
  /** Optional filter by role (backend `UserRole`) */
  role?: string
}

export type AdminUserListResult = {
  users: ApiAdminUser[]
  meta: ApiAdminUserListMeta
}

/** Normalized stats for UI cards — backend may use different key casings */
export type AdminUserStatsNormalized = {
  totalUsers: number
  newUsers7d: number
  restrictedUsers: number
  suspendedUsers?: number
  activeUsers?: number
}

export type AdminListMeta = {
  total: number
  page: number
  limit: number
  totalPages?: number
}

export type ApiAdminTransactionUser = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export type ApiAdminTransaction = {
  id?: string
  transactionId?: string
  /** Backend often sends VTU service as `type` (e.g. AIRTIME, DATA) */
  type?: ApiServiceType | string
  amount?: number
  status?: ApiTxStatus | string
  paymentStatus?: ApiPaymentStatus | string
  serviceType?: ApiServiceType | string
  provider?: string
  providerName?: string
  recipient?: string
  recipientPhone?: string
  recipientDetail?: string
  paymentReference?: string
  paystackReference?: string
  reference?: string
  providerResponse?: string
  failureReason?: string
  errorMessage?: string
  createdAt?: string
  updatedAt?: string
  user?: ApiAdminTransactionUser
  userId?: string
}

export type AdminTransactionListQuery = {
  status?: ApiTxStatus | string
  paymentStatus?: ApiPaymentStatus | string
  type?: ApiServiceType | string
  search?: string
  page?: number
  limit?: number
  from?: string
  to?: string
}

export type AdminTransactionListResult = {
  transactions: ApiAdminTransaction[]
  meta: AdminListMeta
}

export type AdminRefundListQuery = {
  status?: ApiTxStatus
  page?: number
  limit?: number
}

export type AdminSupportTicketListQuery = {
  status?: ApiTicketStatus
  page?: number
  limit?: number
}

export type ApiSupportTicket = {
  id?: string
  ticketId?: string
  subject?: string
  title?: string
  topic?: string
  description?: string
  status?: ApiTicketStatus | string
  priority?: string
  createdAt?: string
  updatedAt?: string
  user?: ApiAdminTransactionUser & { name?: string }
  userName?: string
}

export type AdminSupportTicketListResult = {
  tickets: ApiSupportTicket[]
  meta: AdminListMeta
}

export type ApiServiceConfig = {
  serviceType?: ApiServiceType | string
  type?: ApiServiceType | string
  enabled?: boolean
  isActive?: boolean
  active?: boolean
  markupPercent?: number
  markup?: number
  updatedAt?: string
  provider?: string
  label?: string
}

export type ApiAdminProfile = {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  role?: ApiUserRole | string
}

export type ApiAdminNotification = {
  id?: string
  title?: string
  message?: string
  body?: string
  createdAt?: string
  read?: boolean
}

export type MonthlySalesDatum = {
  month: string
  airtime: number
  data: number
  electricity: number
  cable: number
}

/** Row from `GET /admin/pricing` */
export type ApiPricingEntry = {
  id?: string
  serviceType?: ApiServiceType | string
  type?: ApiServiceType | string
  provider?: string
  providerName?: string
  providerCode?: string
  basePrice?: number
  baseAmount?: number
  amount?: number
  markupPercent?: number
  markup?: number
  finalPrice?: number
  sellingPrice?: number
  price?: number
  updatedAt?: string
}

export type AdminPricingListQuery = {
  serviceType?: ApiServiceType
  provider?: string
}

export type UpdatePricingMarkupBody = {
  serviceType: ApiServiceType
  markupPercent: number
  /** Omit for service-wide markup (all providers under this type). */
  provider?: string
}
