import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserBookings } from '../../services/mockApi';
import { Booking, BookingStatus } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import BookingStatusTimeline from '../../components/BookingStatusTimeline';

const getStatusColor = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.CREATED: return 'text-yellow-300 border-yellow-500/50';
        case BookingStatus.ASSIGNED: return 'text-blue-300 border-blue-500/50';
        case BookingStatus.IN_TRANSIT: return 'text-cyan-300 border-cyan-500/50';
        case BookingStatus.DELIVERED: return 'text-green-300 border-green-500/50';
        case BookingStatus.CANCELLED: return 'text-red-300 border-red-500/50';
        default: return 'text-slate-300 border-slate-500/50';
    }
}

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

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => (
    <Card>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-slate-400">Booking ID</p>
                <p className="font-mono font-semibold text-slate-200">{booking.bookingCode}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>{booking.status}</span>
        </div>
        <div className="my-4 border-t border-slate-700/50"></div>
        <div className="space-y-2 text-sm">
            <p><span className="font-semibold text-slate-400">From:</span> {booking.pickupAddress}</p>
            <p><span className="font-semibold text-slate-400">To:</span> {booking.dropAddress}</p>
        </div>
        <div className="my-4">
             <BookingStatusTimeline currentStatus={booking.status} />
        </div>
        <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-slate-400">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
            <Link to={`/user/track/${booking.id}`}>
                <Button variant="secondary" className="py-1 px-3">
                    Track & Details
                </Button>
            </Link>
        </div>
    </Card>
);

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const userBookings = await fetchUserBookings(user.id);
                    setBookings(userBookings);
                } catch (error) {
                    console.error("Failed to load user data", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [user]);

    const stats = useMemo(() => {
        const active = bookings.filter(b => b.status !== BookingStatus.DELIVERED && b.status !== BookingStatus.CANCELLED).length;
        const completed = bookings.filter(b => b.status === BookingStatus.DELIVERED).length;
        return { active, completed };
    }, [bookings]);

    if (loading) return <div className="text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
                    <p className="text-slate-400 mt-1">Here's an overview of your luggage deliveries.</p>
                </div>
                <Link to="/user/booking">
                    <Button className="w-full sm:w-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        New Booking
                    </Button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard title="Total Bookings" value={bookings.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                 <StatCard title="Active Deliveries" value={stats.active} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                 <StatCard title="Completed Trips" value={stats.completed} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
                {bookings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bookings.map(b => <BookingCard key={b.id} booking={b} />)}
                    </div>
                ) : (
                    <Card className="text-center py-12">
                        <p className="text-slate-400">You haven't made any bookings yet.</p>
                        <Link to="/user/booking" className="mt-4 inline-block">
                             <Button>Make Your First Booking</Button>
                        </Link>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;