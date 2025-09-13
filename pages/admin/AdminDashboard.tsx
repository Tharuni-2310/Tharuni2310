import React, { useEffect, useState, useMemo } from 'react';
import { AdminOverview, Booking, BookingStatus, User, Role } from '../../types';
import { fetchAdminOverview, fetchAllBookings, fetchAllUsers, verifyAgent } from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const StatCard: React.FC<{ title: string, value: string | number, icon: JSX.Element }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </Card>
);

const TABS = ['Overview', 'Users', 'Bookings'];

const AdminDashboard: React.FC = () => {
    const [overview, setOverview] = useState<AdminOverview | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(TABS[0]);

    const refreshData = async () => {
         try {
            setLoading(true);
            const [overviewData, allUsers, allBookings] = await Promise.all([
                fetchAdminOverview(),
                fetchAllUsers(),
                fetchAllBookings(),
            ]);
            setOverview(overviewData);
            setUsers(allUsers);
            setBookings(allBookings);
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshData();
    }, []);
    
    const handleVerifyAgent = async (agentId: string) => {
        await verifyAgent(agentId);
        refreshData();
    };

    const bookingStatusData = useMemo(() => {
        const statusCounts = bookings.reduce((acc, booking) => {
            acc[booking.status] = (acc[booking.status] || 0) + 1;
            return acc;
        }, {} as Record<BookingStatus, number>);
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [bookings]);

    const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f97316', '#ef4444', '#64748b'];

    if (loading && !overview) return <div className="text-center">Loading admin panel...</div>;
    if (!overview) return <div className="text-center text-red-400">Could not load overview data.</div>;
    
    const UserIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    const AgentIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    const BookingIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    const RevenueIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'Overview' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Users" value={overview.totalUsers} icon={UserIcon} />
                        <StatCard title="Total Agents" value={overview.totalAgents} icon={AgentIcon} />
                        <StatCard title="Total Bookings" value={overview.totalBookings} icon={BookingIcon} />
                        <StatCard title="Total Revenue" value={`$${overview.totalRevenue.toFixed(2)}`} icon={RevenueIcon} />
                    </div>
                     <Card title="Booking Status Distribution">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    {/* FIX: The type for recharts label function props is not correctly inferred. Using `any` to bypass the TypeScript error. */}
                                    <Pie data={bookingStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {bookingStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            )}
            
            {activeTab === 'Users' && (
                <Card title="Manage Users">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-700/50 text-xs text-slate-300 uppercase">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                           </thead>
                           <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full capitalize ${u.role === Role.ADMIN ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-600'}`}>{u.role}</span></td>
                                    <td className="p-3">
                                        {u.role === Role.AGENT && (
                                            <span className={`px-2 py-1 text-xs rounded-full ${u.verified ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                                {u.verified ? 'Verified' : 'Unverified'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 text-right">
                                        {u.role === Role.AGENT && !u.verified && (
                                            <Button onClick={() => handleVerifyAgent(u.id)} variant="secondary" className="py-1 px-2">Verify</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                           </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeTab === 'Bookings' && (
                 <Card title="All Bookings">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-700/50 text-xs text-slate-300 uppercase">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">User</th>
                                    <th className="p-3">Agent</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Price</th>
                                </tr>
                           </thead>
                           <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                    <td className="p-3 text-sm font-mono">{b.bookingCode}</td>
                                    <td className="p-3 text-sm">{users.find(u => u.id === b.userId)?.name || 'N/A'}</td>
                                    <td className="p-3 text-sm">{users.find(u => u.id === b.agentId)?.name || 'Unassigned'}</td>
                                    <td className="p-3 text-sm">{b.status}</td>
                                    <td className="p-3 text-sm font-semibold">${b.price.toFixed(2)}</td>
                                </tr>
                            ))}
                           </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboard;