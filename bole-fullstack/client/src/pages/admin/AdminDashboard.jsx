import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ShoppingCart, Package, MessageSquare, TrendingUp, AlertTriangle, DollarSign, CheckCircle, Clock } from 'lucide-react';

const STATUS_BADGE = { pending:'badge-pending', confirmed:'badge-confirmed', processing:'badge-processing', delivered:'badge-delivered', cancelled:'badge-cancelled' };
const COLORS = ['#1B4D2E','#2D7A47','#C8920A','#F0B429','#6ec96f'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(r => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-96 text-gray-400">Loading dashboard...</div>
    </AdminLayout>
  );

  const monthLabels = { '2024-08':'Aug','2024-09':'Sep','2024-10':'Oct','2024-11':'Nov','2024-12':'Dec','2025-01':'Jan' };

  return (
    <AdminLayout stats={data}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-heading font-black text-2xl text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening at Bole Animal Feed Processing.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label:'Total Orders',    value: data.total_orders,    sub:`${data.pending_orders} pending`, icon: ShoppingCart, color:'bg-blue-50 text-blue-700' },
            { label:'Revenue (Paid)',  value:`${(data.total_revenue||0).toLocaleString()} ETB`, sub:`${(data.pending_revenue||0).toLocaleString()} pending`, icon: DollarSign, color:'bg-green-50 text-green-700' },
            { label:'Unread Messages', value: data.unread_messages, sub:'Need response', icon: MessageSquare, color:'bg-amber-50 text-amber-700' },
            { label:'Low Stock Items', value: data.low_stock,       sub:'Below alert level', icon: AlertTriangle, color:'bg-red-50 text-red-700' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon size={20} />
                </div>
              </div>
              <div className="font-heading font-black text-2xl text-gray-800">{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Order status row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label:'Pending',   value: data.pending_orders,   color:'bg-amber-500' },
            { label:'Confirmed', value: data.confirmed_orders, color:'bg-blue-500' },
            { label:'Delivered', value: data.delivered_orders, color:'bg-green-600' },
            { label:'Cancelled', value: data.cancelled_orders, color:'bg-red-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
              <div className={`w-3 h-10 rounded-full ${s.color}`} />
              <div>
                <div className="font-heading font-black text-xl text-gray-800">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label} Orders</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly sales */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-heading font-bold text-gray-800 mb-4">Monthly Sales (Bags)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.monthly_sales.map(m => ({ ...m, name: monthLabels[m.month] || m.month }))}>
                <XAxis dataKey="name" tick={{ fontSize:12 }} />
                <YAxis tick={{ fontSize:12 }} />
                <Tooltip formatter={(v, n) => [v, n === 'bags' ? 'Bags Sold' : 'Revenue (ETB)']} />
                <Bar dataKey="bags" fill="#1B4D2E" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sales by product */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-heading font-bold text-gray-800 mb-4">Sales by Product</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.sales_by_product} dataKey="total_qty" nameKey="product_name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}>
                  {data.sales_by_product.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} bags`]} />
                <Legend formatter={(value) => <span style={{fontSize:11}}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row: recent orders + top products */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-gray-800">Recent Orders</h2>
              <Link to="/admin/orders" className="text-green-700 text-sm font-semibold hover:underline">View all →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="table-th">Ref</th>
                    <th className="table-th">Customer</th>
                    <th className="table-th">Product</th>
                    <th className="table-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="table-td font-mono text-xs text-gray-500">{o.order_ref}</td>
                      <td className="table-td font-semibold text-sm">{o.customer_name}</td>
                      <td className="table-td text-xs text-gray-500 max-w-[120px] truncate">{o.product_name}</td>
                      <td className="table-td"><span className={`badge ${STATUS_BADGE[o.status]||''}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading font-bold text-gray-800 mb-4">Top Selling Products</h2>
            <div className="space-y-4">
              {data.sales_by_product.map((p, i) => {
                const max = data.sales_by_product[0]?.total_qty || 1;
                return (
                  <div key={p.product_name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-gray-700 truncate">{p.product_name}</span>
                      <span className="text-gray-500 ml-2 flex-shrink-0">{p.total_qty} bags</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width:`${(p.total_qty/max)*100}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
