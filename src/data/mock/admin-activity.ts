import type { ActivityItem } from '@/types/admin'

export const mockActivityFeed: ActivityItem[] = [
  {
    id: '1',
    title: 'Bulk airtime purchase',
    description: 'Corporate wallet funded ₦5,000,000 — 1,240 MTN pins queued',
    tone: 'info',
    time: '2 min ago',
  },
  {
    id: '2',
    title: 'Failed token reconciliation',
    description: 'IKEDC token delivery retried successfully for TXN-908198',
    tone: 'success',
    time: '8 min ago',
  },
  {
    id: '3',
    title: 'New user registration spike',
    description: '+312 sign-ups in the last hour (Lagos geo cluster)',
    tone: 'info',
    time: '26 min ago',
  },
  {
    id: '4',
    title: 'DSTV bouquet drift',
    description: 'Compact+ pricing mismatch flagged vs provider sheet v3.2',
    tone: 'warning',
    time: '41 min ago',
  },
  {
    id: '5',
    title: '9mobile route latency',
    description: 'P95 latency 1.8s — auto-failover engaged to secondary route',
    tone: 'danger',
    time: '55 min ago',
  },
]
