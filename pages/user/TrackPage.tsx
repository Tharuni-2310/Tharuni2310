import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookingDetails } from '../../services/mockApi';
import { Booking } from '../../types';
import Card from '../../components/ui/Card';
import BookingStatusTimeline from '../../components/BookingStatusTimeline';

// Mock QR Code Generator
const QRDisplay: React.FC<{ qrToken: string }> = ({ qrToken }) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrToken)}&bgcolor=1e293b&color=06b6d4&qzone=1`;
    return (
        <div className="p-4 bg-slate-900 rounded-lg flex flex-col items-center">
            <img src={qrCodeUrl} alt="Booking QR Code" className="w-48 h-48 rounded-md border border-slate-700" />
            <p className="mt-3 text-xs text-slate-400 text-center">Show this to the agent for pickup verification</p>
        </div>
    );
};

// Mock Live Map View
const MockMapView: React.FC = () => {
    const [agentPosition, setAgentPosition] = useState({ x: 20, y: 80 });

    useEffect(() => {
        const interval = setInterval(() => {
            setAgentPosition(prev => ({
                x: Math.min(80, prev.x + 2),
                y: 80 - ( (Math.min(80, prev.x + 2) / 80) * 60)
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-slate-700 rounded-lg overflow-hidden relative flex items-center justify-center">
             <img src="https://i.imgur.com/s4J7feA.png" alt="Map background" className="absolute w-full h-full object-cover opacity-20"/>
            <svg className="w-full h-full absolute" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Route Path */}
                <path d="M 20 80 Q 50 70, 80 20" stroke="#0891b2" strokeWidth="1" fill="none" strokeDasharray="2 2" />

                {/* Pickup Point */}
                <circle cx="20" cy="80" r="2" fill="#06b6d4" />
                <circle cx="20" cy="80" r="4" fill="#06b6d4" opacity="0.3" >
                     <animate attributeName="r" from="3" to="5" dur="1.5s" repeatCount="indefinite" />
                </circle>

                {/* Dropoff Point */}
                <circle cx="80" cy="20" r="2" fill="#3b82f6" />

                {/* Agent Marker */}
                <circle cx={agentPosition.x} cy={agentPosition.y} r="2.5" fill="white" stroke="#3b82f6" strokeWidth="1" className="transition-all duration-2000 ease-linear" />
            </svg>
            <div className="z-10 bg-slate-900/50 px-3 py-1 rounded-md text-xs">Simulated Live Tracking</div>
        </div>
    );
};


const TrackPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;
        
        const loadBooking = async () => {
            try {
                const data = await fetchBookingDetails(bookingId);
                setBooking(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
        // Mocking live updates
        const interval = setInterval(loadBooking, 5000); 
        return () => clearInterval(interval);

    }, [bookingId]);

    if (loading) return <div className="text-center">Loading tracking details...</div>;
    if (!booking) return <div className="text-center text-red-400">Could not find booking details.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[60vh] lg:h-auto">
                <Card className="h-full" title="Live Tracking">
                    <MockMapView />
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <h2 className="text-lg font-semibold mb-1">Booking Status</h2>
                    <p className="text-sm text-slate-400 mb-4 font-mono">{booking.bookingCode}</p>
                    <BookingStatusTimeline currentStatus={booking.status} />
                </Card>

                {booking.agent && (
                    <Card title="Agent Details">
                        <div className="flex items-center space-x-4">
                            <img src={`https://i.pravatar.cc/150?u=${booking.agent.id}`} alt="Agent" className="w-16 h-16 rounded-full border-2 border-slate-600"/>
                            <div>
                                <p className="font-bold text-lg">{booking.agent.name}</p>
                                <p className="text-sm text-slate-400">{booking.agent.vehicle}</p>
                                <p className="text-sm text-cyan-400">Rating: {booking.agent.rating} ★</p>
                            </div>
                        </div>
                    </Card>
                )}

                <Card title="Your QR Code">
                    <QRDisplay qrToken={booking.qrToken} />
                </Card>
            </div>
        </div>
    );
};

export default TrackPage;