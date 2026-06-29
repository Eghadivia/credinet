export interface NetworkProvider {
  id: string;
  name: string;
  logo: string;
  status: string;
}

export interface AirtimePaymentState {
  step: 'provider' | 'phone' | 'amount' | 'review';
  selectedProvider: NetworkProvider | null;
  phoneNumber: string;
  recipientType: 'self' | 'others';
  amount: number;
}


export const NETWORK_PROVIDERS: NetworkProvider[] = [
  {
    id: 'mtn',
    name: 'MTN Nigeria',
    logo: '/mtn-logo.png',
    status: 'ACTIVE & AVAILABLE',
  },
  {
    id: 'airtel',
    name: 'Airtel Nigeria',
    logo: '/airtel-logo.png',
    status: 'INSTANT ACTIVATION',
  },
  {
    id: 'glo',
    name: 'Globacom (Glo)',
    logo: '/glo-logo.png',
    status: 'INSTANT DELIVERY',
  },
  {
    id: '9mobile',
    name: '9mobile',
    logo: '/9mobile-logo.png',
    status: 'RELIABLE NETWORK',
  },
];

export const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000];
