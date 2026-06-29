import type { AdminUserRow } from '@/types/admin'

export const mockUsers: AdminUserRow[] = [
  {
    id: 'USR-10291',
    fullName: 'Chinonso Okafor',
    email: 'chinonso.okafor@email.ng',
    phone: '+234 803 221 8841',
    registeredAt: '02 Apr 2026',
    status: 'Active',
  },
  {
    id: 'USR-10290',
    fullName: 'Adaeze Eze',
    email: 'adaeze.eze@email.ng',
    phone: '+234 706 118 2290',
    registeredAt: '28 Mar 2026',
    status: 'Active',
  },
  {
    id: 'USR-10289',
    fullName: 'Tunde Bakare',
    email: 'tunde.b@email.ng',
    phone: '+234 802 901 4412',
    registeredAt: '15 Mar 2026',
    status: 'Suspended',
  },
  {
    id: 'USR-10288',
    fullName: 'Ngozi Ude',
    email: 'ngozi.u@email.ng',
    phone: '+234 813 771 0092',
    registeredAt: '09 Mar 2026',
    status: 'Restricted',
  },
  {
    id: 'USR-10287',
    fullName: 'Emeka Obi',
    email: 'emeka.obi@email.ng',
    phone: '+234 905 221 1188',
    registeredAt: '01 Mar 2026',
    status: 'Active',
  },
]
