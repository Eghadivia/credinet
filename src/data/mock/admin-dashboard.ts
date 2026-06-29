export const dashboardStatCards = [
  {
    title: 'Total Transactions',
    value: '184,920',
    delta: '+6.4%',
    trend: 'up' as const,
    hint: 'vs last 30 days',
  },
  {
    title: 'Successful Transactions',
    value: '178,402',
    delta: '+5.1%',
    trend: 'up' as const,
    hint: '96.5% success rate',
  },
  {
    title: 'Failed Transactions',
    value: '3,118',
    delta: '-1.2%',
    trend: 'down' as const,
    hint: 'retry recovery 38%',
  },
  {
    title: 'Pending Transactions',
    value: '3,400',
    delta: '+0.8%',
    trend: 'up' as const,
    hint: 'avg settle 6m',
  },
  {
    title: 'Daily Revenue',
    value: '₦12.4M',
    delta: '+9.2%',
    trend: 'up' as const,
    hint: 'today (WAT)',
  },
]

export const monthlySalesSeries = [
  { month: 'Jan', airtime: 42, data: 38, electricity: 18, cable: 22 },
  { month: 'Feb', airtime: 45, data: 41, electricity: 19, cable: 23 },
  { month: 'Mar', airtime: 48, data: 44, electricity: 21, cable: 25 },
  { month: 'Apr', airtime: 46, data: 47, electricity: 20, cable: 24 },
  { month: 'May', airtime: 52, data: 50, electricity: 23, cable: 27 },
  { month: 'Jun', airtime: 55, data: 53, electricity: 24, cable: 29 },
  { month: 'Jul', airtime: 58, data: 56, electricity: 26, cable: 31 },
  { month: 'Aug', airtime: 57, data: 58, electricity: 25, cable: 30 },
  { month: 'Sep', airtime: 61, data: 60, electricity: 27, cable: 33 },
  { month: 'Oct', airtime: 64, data: 63, electricity: 28, cable: 35 },
  { month: 'Nov', airtime: 66, data: 65, electricity: 29, cable: 36 },
  { month: 'Dec', airtime: 70, data: 69, electricity: 31, cable: 38 },
]

export const weeklyActivitySeries = [
  { day: 'Mon', transactions: 8200, revenue: 9.2 },
  { day: 'Tue', transactions: 9100, revenue: 10.1 },
  { day: 'Wed', transactions: 8800, revenue: 9.8 },
  { day: 'Thu', transactions: 9600, revenue: 11.4 },
  { day: 'Fri', transactions: 10200, revenue: 12.0 },
  { day: 'Sat', transactions: 7800, revenue: 8.6 },
  { day: 'Sun', transactions: 6900, revenue: 7.9 },
]

export const revenueBreakdown = [
  { name: 'Airtime', value: 38, fill: 'hsl(var(--chart-1))' },
  { name: 'Data', value: 32, fill: 'hsl(var(--chart-2))' },
  { name: 'Electricity', value: 16, fill: 'hsl(var(--chart-3))' },
  { name: 'Cable TV', value: 14, fill: 'hsl(var(--chart-4))' },
]

export const topServices = [
  { name: 'MTN Airtime', volume: '₦482M', share: '28%' },
  { name: 'MTN SME Data', volume: '₦361M', share: '21%' },
  { name: 'IKEDC Tokens', volume: '₦214M', share: '12%' },
  { name: 'DSTV Compact+', volume: '₦198M', share: '11%' },
]
