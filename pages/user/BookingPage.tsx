
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createBooking, processPayment } from '../../services/mockApi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const BookingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropAddress, setDropAddress] = useState('');
    const [luggageWeight, setLuggageWeight] = useState(10);
    const [price, setPrice] = useState(18.50);
    const [bookingState, setBookingState] = useState<'form' | 'processing' | 'confirmed'>('form');

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = parseInt(e.target.value, 10);
        setLuggageWeight(weight);
        // Mock price calculation
        setPrice(15 + weight * 0.35);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setBookingState('processing');

        try {
            const newBooking = await createBooking({
                userId: user.id,
                pickupAddress,
                dropAddress,
                luggageWeight,
                price
            });

            const paymentSuccess = await processPayment(newBooking.id);

            if (paymentSuccess) {
                setBookingState('confirmed');
                setTimeout(() => {
                    navigate(`/user/track/${newBooking.id}`);
                }, 2500);
            } else {
                throw new Error("Payment failed");
            }
        } catch (error) {
            console.error("Booking failed", error);
            setBookingState('form');
        }
    };

    const renderContent = () => {
        switch (bookingState) {
            case 'processing':
                return (
                    <div className="text-center py-16">
                        <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h3 className="mt-4 text-xl font-semibold">Processing Payment...</h3>
                        <p className="text-slate-400">Please wait while we securely confirm your booking.</p>
                    </div>
                );
            case 'confirmed':
                 return (
                    <div className="text-center py-16">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <h3 className="mt-4 text-2xl font-bold text-green-300">Booking Confirmed!</h3>
                        <p className="text-slate-300">Your payment was successful. Redirecting you to the tracking page...</p>
                    </div>
                );
            case 'form':
            default:
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label htmlFor="pickup" className="block text-sm font-medium text-slate-300 mb-1">Pickup Address</label>
                             <div className="absolute inset-y-0 left-0 top-6 flex items-center pl-3 pointer-events-none">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            </div>
                            <input id="pickup" type="text" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required placeholder="e.g., 123 Main St, Anytown" className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div className="relative">
                            <label htmlFor="dropoff" className="block text-sm font-medium text-slate-300 mb-1">Drop-off Address</label>
                            <div className="absolute inset-y-0 left-0 top-6 flex items-center pl-3 pointer-events-none">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            </div>
                            <input id="dropoff" type="text" value={dropAddress} onChange={e => setDropAddress(e.target.value)} required placeholder="e.g., 789 Oak Ave, Anytown" className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-slate-300 mb-1">Luggage Weight ({luggageWeight} kg)</label>
                            <input id="weight" type="range" min="1" max="50" value={luggageWeight} onChange={handleWeightChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        </div>
                        
                        <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                            <p className="text-lg font-semibold">Estimated Price:</p>
                            <p className="text-2xl font-bold text-cyan-400">${price.toFixed(2)}</p>
                        </div>
                        {/* FIX: The isLoading prop had an impossible condition that would always be false. It should check if the bookingState is 'processing'. */}
                        <Button type="submit" isLoading={bookingState === 'processing'} className="w-full py-3 text-base font-bold">
                            Confirm & Book Now
                        </Button>
                    </form>
                );
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card title={bookingState === 'form' ? "Create New Booking" : "Booking Status"}>
                {renderContent()}
            </Card>
        </div>
    );
};

export default BookingPage;
