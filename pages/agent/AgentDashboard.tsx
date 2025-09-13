import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAgentBookings, fetchAgentStats, updateBookingStatus, acceptBooking } from '../../services/mockApi';
import { Booking, AgentStats, BookingStatus } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QRScanner from './QRScanner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

const AgentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<AgentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isScanning, setIsScanning] = useState<string | null>(null); // holds bookingId

    const refreshData = async () => {
        if (user) {
            try {
                setLoading(true);
                const [agentBookings, agentStats] = await Promise.all([
                    fetchAgentBookings(user.id),
                    fetchAgentStats(user.id)
                ]);
                setBookings(agentBookings);
                setStats(agentStats);
            } catch (error) {
                console.error("Failed to load agent data", error);
            } finally {
                setLoading(false);
            }
        }
    }
    
    useEffect(() => {
        refreshData();
    }, [user]);

    const handleScanSuccess = async () => {
        setIsScanning(null);
        refreshData();
    };
    
    const handleAcceptBooking = async (bookingId: string) => {
        if(!user) return;
        await acceptBooking(bookingId, user.id);
        refreshData();
    }

    const handleMarkDelivered = async (bookingId: string) => {
        await updateBookingStatus(bookingId, BookingStatus.DELIVERED);
        refreshData();
    };

    if (loading && !stats) return <div className="text-center">Loading agent dashboard...</div>;
    if (!stats) return <div className="text-center text-red-400">Could not load agent stats.</div>;
    
    if (isScanning) {
        return <QRScanner bookingId={isScanning} onSuccess={() => handleScanSuccess()} onCancel={() => setIsScanning(null)} />;
    }

    const availableBookings = bookings.filter(b => b.status === BookingStatus.CREATED);
    const activeBookings = bookings.filter(b => b.status !== BookingStatus.CREATED);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold">Agent Dashboard</h1>
                <div className="flex items-center space-x-4 p-2 bg-slate-800 rounded-lg">
                    <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                        {isOnline ? 'You are Online' : 'You are Offline'}
                    </span>
                    <label htmlFor="online-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="online-toggle" className="sr-only peer" checked={isOnline} onChange={() => setIsOnline(!isOnline)} />
                        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Today's Earnings" value={`$${stats.todayEarnings.toFixed(2)}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <StatCard title="Your Rating" value={`${stats.rating} ★`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} />
                <StatCard title="Active Jobs" value={activeBookings.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="My Active Jobs">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {activeBookings.length > 0 ? activeBookings.map(b => (
                            <div key={b.id} className="p-4 bg-slate-900/50 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                               <div>
                                   <p className="font-bold font-mono">{b.bookingCode}</p>
                                   <p className="text-sm text-slate-400">To: {b.dropAddress}</p>
                                   <p className="text-sm font-semibold text-cyan-400">Status: {b.status}</p>
                               </div>
                               <div className="flex gap-2">
                                   {b.status === BookingStatus.ASSIGNED && <Button onClick={() => setIsScanning(b.id)}>Start & Scan QR</Button>}
                                   {b.status === BookingStatus.IN_TRANSIT && <Button onClick={() => handleMarkDelivered(b.id)} variant="secondary">Mark Delivered</Button>}
                               </div>
                            </div>
                        )) : <p className="text-center text-slate-400 py-8">No active jobs. Accept one from the available list!</p>}
                    </div>
                </Card>
                 <Card title="Available for Pickup">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {availableBookings.length > 0 ? availableBookings.map(b => (
                            <div key={b.id} className="p-4 bg-slate-900/50 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                               <div>
                                   <p className="font-bold text-lg">${b.price.toFixed(2)}</p>
                                   <p className="text-sm text-slate-400">From: {b.pickupAddress}</p>
                                   <p className="text-sm text-slate-400">To: {b.dropAddress}</p>
                               </div>
                               <div className="flex gap-2">
                                   <Button onClick={() => handleAcceptBooking(b.id)} variant='secondary'>Accept Job</Button>
                               </div>
                            </div>
                        )) : <p className="text-center text-slate-400 py-8">No available jobs nearby. Stay online to get notified!</p>}
                    </div>
                </Card>
            </div>

            <Card title="Weekly Performance">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={stats.weeklyEarnings} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="day" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} cursor={{fill: '#334155'}}/>
                            <Legend wrapperStyle={{ color: '#e2e8f0' }}/>
                            <Bar dataKey="earnings" fill="#06b6d4" name="Earnings ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default AgentDashboard;