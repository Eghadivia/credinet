'use client'

import { useMemo, useState } from 'react'
import { Download, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Mock data for transactions
const mockTransactions = [
  {
    id: 'TXN001',
    date: new Date().toISOString().split('T')[0],
    customer: 'John Doe',
    service: 'Airtime - MTN',
    amount: 1000,
    providerCost: 950,
    status: 'Completed',
    time: '09:30',
  },
  {
    id: 'TXN002',
    date: new Date().toISOString().split('T')[0],
    customer: 'Jane Smith',
    service: 'Data Bundle - Airtel',
    amount: 2500,
    providerCost: 2350,
    status: 'Completed',
    time: '10:15',
  },
  {
    id: 'TXN003',
    date: new Date().toISOString().split('T')[0],
    customer: 'Mike Johnson',
    service: 'Electricity - EKEDC',
    amount: 5000,
    providerCost: 4800,
    status: 'Completed',
    time: '11:45',
  },
  {
    id: 'TXN004',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    customer: 'Sarah Williams',
    service: 'Cable TV - DSTV',
    amount: 3000,
    providerCost: 2850,
    status: 'Completed',
    time: '14:20',
  },
  {
    id: 'TXN005',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    customer: 'Alex Brown',
    service: 'Airtime - Glo',
    amount: 1500,
    providerCost: 1425,
    status: 'Completed',
    time: '15:30',
  },
  {
    id: 'TXN006',
    date: new Date().toISOString().split('T')[0],
    customer: 'Emma Davis',
    service: 'Data Bundle - 9Mobile',
    amount: 1800,
    providerCost: 1710,
    status: 'Completed',
    time: '16:45',
  },
]

function formatNaira(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function exportToCSV(transactions: typeof mockTransactions) {
  const headers = ['Transaction ID', 'Date', 'Time', 'Customer', 'Service', 'Amount (₦)', 'Provider Cost (₦)', 'Profit (₦)', 'Status']
  
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.time,
    t.customer,
    t.service,
    t.amount.toString(),
    t.providerCost.toString(),
    (t.amount - t.providerCost).toString(),
    t.status,
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface PricingRow {
  id: string
  serviceName: string
  providerName: string
  basePrice: number
  markupPercent: number
  finalPrice: number
}

const pricingMarkupRows: PricingRow[] = [
  {
    id: 'PR001',
    serviceName: 'Airtime',
    providerName: 'MTN',
    basePrice: 950,
    markupPercent: 5.3,
    finalPrice: 1000,
  },
  {
    id: 'PR002',
    serviceName: 'Airtime',
    providerName: 'Airtel',
    basePrice: 940,
    markupPercent: 6.4,
    finalPrice: 1000,
  },
  {
    id: 'PR003',
    serviceName: 'Data Bundle',
    providerName: 'Glo',
    basePrice: 2350,
    markupPercent: 6.4,
    finalPrice: 2500,
  },
  {
    id: 'PR004',
    serviceName: 'Electricity',
    providerName: 'EKEDC',
    basePrice: 4800,
    markupPercent: 4.2,
    finalPrice: 5000,
  },
]

export function ServiceManagementView() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate())

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((t) => t.date === selectedDate && t.status === 'Completed')
  }, [selectedDate])

  const totalPayments = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  }, [filteredTransactions])

  const totalProviderCost = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.providerCost, 0)
  }, [filteredTransactions])

  const totalProfit = totalPayments - totalProviderCost

  return (
    <div className="space-y-8">
      {/* Pricing & Markup Management Table */}
      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Pricing & Markup Management</CardTitle>
          <CardDescription className="text-zinc-600">Manage service pricing and markup percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/80">
                  <TableHead>Service Name</TableHead>
                  <TableHead>Provider Name</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Markup Percentage</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingMarkupRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium text-zinc-900">{row.serviceName}</TableCell>
                    <TableCell>{row.providerName}</TableCell>
                    <TableCell>{formatNaira(row.basePrice)}</TableCell>
                    <TableCell>{row.markupPercent}%</TableCell>
                    <TableCell className="font-semibold text-zinc-900">{formatNaira(row.finalPrice)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" className="rounded-xl border-zinc-200" type="button" disabled>
                        <Settings2 className="mr-2 h-4 w-4" />
                        Update Markup
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-50/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-900">Total Payments</CardTitle>
            <CardDescription className="text-zinc-600">Amount received from customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">{formatNaira(totalPayments)}</div>
              <p className="text-sm text-zinc-600">
                {filteredTransactions.length} successful transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-red-200/50 bg-gradient-to-br from-red-50 to-red-50/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-900">Total Payable to Provider</CardTitle>
            <CardDescription className="text-zinc-600">Amount to be paid to service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">{formatNaira(totalProviderCost)}</div>
              <p className="text-sm text-zinc-600">
                Profit: <span className="font-semibold text-green-600">{formatNaira(totalProfit)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg text-zinc-900">Transactions</CardTitle>
              <CardDescription className="text-zinc-600">View successful transactions by date</CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 rounded-xl border-zinc-200 bg-white sm:w-56"
              />
              <Button
                onClick={() => exportToCSV(filteredTransactions)}
                variant="outline"
                className="h-11 rounded-xl border-zinc-200"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/80">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Provider Cost</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-blue-600">{transaction.id}</TableCell>
                      <TableCell className="text-zinc-600">{transaction.time}</TableCell>
                      <TableCell className="text-zinc-900">{transaction.customer}</TableCell>
                      <TableCell className="text-zinc-900">{transaction.service}</TableCell>
                      <TableCell className="font-semibold text-zinc-900">{formatNaira(transaction.amount)}</TableCell>
                      <TableCell className="text-zinc-600">{formatNaira(transaction.providerCost)}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatNaira(transaction.amount - transaction.providerCost)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-zinc-500">
                      No successful transactions found for the selected date.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
