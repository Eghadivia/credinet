import type { PricingRow, ProviderRow, ServiceConfigRow } from '@/types/admin'

export const serviceConfigurationRows: ServiceConfigRow[] = [
  {
    id: 'SRV-1',
    serviceName: 'Airtime Purchase',
    category: 'Airtime',
    status: 'Active',
    updatedAt: '11 May 2026, 08:40',
  },
  {
    id: 'SRV-2',
    serviceName: 'Data Bundle Purchase',
    category: 'Data Bundle',
    status: 'Active',
    updatedAt: '11 May 2026, 08:40',
  },
  {
    id: 'SRV-3',
    serviceName: 'Electricity Bill Payment',
    category: 'Electricity',
    status: 'Active',
    updatedAt: '11 May 2026, 08:39',
  },
  {
    id: 'SRV-4',
    serviceName: 'Cable TV Subscription',
    category: 'Cable TV',
    status: 'Disabled',
    updatedAt: '11 May 2026, 08:12',
  },
]

export const providerManagementRows: ProviderRow[] = [
  { id: 'PRV-1', providerName: 'MTN', category: 'Airtime/Data', serviceAvailability: 'Available' },
  { id: 'PRV-2', providerName: 'Airtel', category: 'Airtime/Data', serviceAvailability: 'Available' },
  { id: 'PRV-3', providerName: 'Globacom (Glo)', category: 'Airtime/Data', serviceAvailability: 'Unavailable' },
  { id: 'PRV-4', providerName: '9mobile', category: 'Airtime/Data', serviceAvailability: 'Available' },
  { id: 'PRV-5', providerName: 'IKEDC', category: 'Electricity', serviceAvailability: 'Available' },
  { id: 'PRV-6', providerName: 'Eko Disco', category: 'Electricity', serviceAvailability: 'Available' },
  { id: 'PRV-7', providerName: 'DStv', category: 'Cable TV', serviceAvailability: 'Available' },
  { id: 'PRV-8', providerName: 'GOtv', category: 'Cable TV', serviceAvailability: 'Available' },
  { id: 'PRV-9', providerName: 'StarTimes', category: 'Cable TV', serviceAvailability: 'Unavailable' },
]

export const pricingMarkupRows: PricingRow[] = [
  {
    id: 'PRC-1',
    serviceType: 'AIRTIME',
    serviceName: 'Airtime',
    providerName: 'MTN',
    basePrice: 1000,
    markupPercent: 2.5,
    finalPrice: 1025,
  },
  {
    id: 'PRC-2',
    serviceType: 'DATA',
    serviceName: 'Data Bundle',
    providerName: 'Airtel',
    basePrice: 3500,
    markupPercent: 3,
    finalPrice: 3605,
  },
  {
    id: 'PRC-3',
    serviceType: 'ELECTRICITY',
    serviceName: 'Electricity',
    providerName: 'IKEDC',
    basePrice: 20000,
    markupPercent: 1.8,
    finalPrice: 20360,
  },
  {
    id: 'PRC-4',
    serviceType: 'CABLE',
    serviceName: 'Cable Subscription',
    providerName: 'DStv',
    basePrice: 24500,
    markupPercent: 2.2,
    finalPrice: 25039,
  },
]
