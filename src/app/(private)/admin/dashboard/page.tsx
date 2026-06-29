"use client";

import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const salesData = [
  { month: 'Jan', airtime: 4000, databundle: 3000, electricity: 2000, cable: 2780 },
  { month: 'Feb', airtime: 3000, databundle: 1398, electricity: 2210, cable: 2290 },
  { month: 'Mar', airtime: 2000, databundle: 9800, electricity: 2290, cable: 2000 },
  { month: 'Apr', airtime: 2780, databundle: 3908, electricity: 2000, cable: 2108 },
  { month: 'May', airtime: 1890, databundle: 4800, electricity: 2181, cable: 2500 },
  { month: 'Jun', airtime: 2390, databundle: 3800, electricity: 2500, cable: 2100 },
]

const revenueData = [
  { name: 'Week 1', revenue: 240000 }, 
  { name: 'Week 2', revenue: 380000 },
  { name: 'Week 3', revenue: 200000 },
  { name: 'Week 4', revenue: 278000 },
  { name: 'Week 5', revenue: 189000 },
]

export default function AdminDashboard() {
  return (
    <div className="-m-6 min-h-full bg-zinc-50 p-6 md:-m-8 md:p-8">
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your admin dashboard. Here&apos;s an overview of your business
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₦48.2M</div>
            <p className="mt-1 text-xs text-emerald-600">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Transactions
            </CardTitle> 
          </CardHeader>
          <CardContent>                                   
            <div className="text-2xl font-bold text-gray-900">12,456</div>
            <p className="mt-1 text-xs text-emerald-600">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <p className="mt-1 text-xs text-gray-500">All online and operational</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">97.8%</div>
            <p className="mt-1 text-xs text-gray-500">Transaction success</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales by Service */}
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Sales by Service</CardTitle>
            <CardDescription className="text-gray-600">Monthly sales across all services</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="airtime" fill="hsl(var(--chart-1))" />
                <Bar dataKey="databundle" fill="hsl(var(--chart-2))" />
                <Bar dataKey="electricity" fill="hsl(var(--chart-3))" />
                <Bar dataKey="cable" fill="hsl(var(--chart-4))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Revenue */}
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Weekly Revenue</CardTitle>
            <CardDescription className="text-gray-600">Revenue trend for the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600">Manage your services quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Button asChild className="primary_bg text-white hover:bg-red-600">
              <Link href="/admin/airtime">Manage Airtime</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-200 bg-white text-gray-800 hover:bg-gray-50">
              <Link href="/admin/databundle">Manage Data</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-200 bg-white text-gray-800 hover:bg-gray-50">
              <Link href="/admin/electricity">Manage Electricity</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-200 bg-white text-gray-800 hover:bg-gray-50">
              <Link href="/admin/cable">Manage Cable</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-200 bg-white text-gray-800 hover:bg-gray-50">
              <Link href="/admin/transactions">View Transactions</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Service Status</CardTitle>
          <CardDescription className="text-gray-600">Current status of all available services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
              <div>
                <p className="font-medium text-gray-900">Airtime Service</p>
                <p className="text-sm text-gray-600">All providers online</p>
              </div>
              <div className="flex h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
              <div>
                <p className="font-medium text-gray-900">Data Bundle Service</p>
                <p className="text-sm text-gray-600">All providers online</p>
              </div>
              <div className="flex h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
              <div>
                <p className="font-medium text-gray-900">Electricity Service</p>
                <p className="text-sm text-gray-600">All DISCOs online</p>
              </div>
              <div className="flex h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
              <div>
                <p className="font-medium text-gray-900">Cable Services</p>
                <p className="text-sm text-gray-600">All providers online</p>
              </div>
              <div className="flex h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
