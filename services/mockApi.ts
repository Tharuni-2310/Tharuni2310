
import { Role, User, Booking, Payment, BookingStatus, AgentStats, AdminOverview } from '../types';

// Mock Database
const users: User[] = [
    { id: 'u1', name: 'John Doe', email: 'user@example.com', role: Role.USER },
    { id: 'u2', name: 'Alice Williams', email: 'alice@example.com', role: Role.USER },
    { id: 'a1', name: 'Jane Smith', email: 'agent@example.com', role: Role.AGENT, verified: true },
    { id: 'a2', name: 'Mike Johnson', email: 'mike@example.com', role: Role.AGENT, verified: false },
    { id: 'adm1', name: 'Admin Boss', email: 'admin@example.com', role: Role.ADMIN },
];

const bookings: Booking[] = [
    { id: 'b1', bookingCode: 'LKNG-84JG7', userId: 'u1', agentId: 'a1', pickupAddress: '123 Main St, Anytown USA', dropAddress: '789 Oak Ave, Anytown USA', luggageWeight: 15, price: 25.50, status: BookingStatus.IN_TRANSIT, paymentStatus: 'Paid', qrToken: 'qr_b1_secret', createdAt: new Date(Date.now() - 86400000).toISOString(), pickupTimestamp: new Date(Date.now() - 80400000).toISOString(), agent: { id: 'a1', name: 'Jane Smith', phone: '555-123-4567', rating: 4.8, vehicle: 'Honda Civic', verified: true } },
    { id: 'b2', bookingCode: 'LKNG-K2F5D', userId: 'u1', pickupAddress: '456 Pine St, Anytown USA', dropAddress: '101 Maple Rd, Anytown USA', luggageWeight: 22, price: 35.00, status: BookingStatus.CREATED, paymentStatus: 'Paid', qrToken: 'qr_b2_secret', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'b3', bookingCode: 'LKNG-9BHT1', userId: 'u1', agentId: 'a1', pickupAddress: '222 Birch Ln, Anytown USA', dropAddress: '333 Elm Ct, Anytown USA', luggageWeight: 10, price: 18.75, status: BookingStatus.DELIVERED, paymentStatus: 'Paid', qrToken: 'qr_b3_secret', createdAt: new Date(Date.now() - 172800000).toISOString(), pickupTimestamp: new Date(Date.now() - 162800000).toISOString(), deliveryTimestamp: new Date(Date.now() - 152800000).toISOString(), agent: { id: 'a1', name: 'Jane Smith', phone: '555-123-4567', rating: 4.8, vehicle: 'Honda Civic', verified: true } },
    { id: 'b4', bookingCode: 'LKNG-G5T8R', userId: 'u2', agentId: 'a1', pickupAddress: '555 Cedar Blvd, Anytown USA', dropAddress: '888 Willow Way, Anytown USA', luggageWeight: 18, price: 29.99, status: BookingStatus.ASSIGNED, paymentStatus: 'Paid', qrToken: 'qr_b4_secret', createdAt: new Date(Date.now() - 18000000).toISOString(), agent: { id: 'a1', name: 'Jane Smith', phone: '555-123-4567', rating: 4.8, vehicle: 'Honda Civic', verified: true } },
    { id: 'b5', bookingCode: 'LKNG-X1Y2Z', userId: 'u2', pickupAddress: '999 Redwood Dr, Anytown USA', dropAddress: '444 Spruce Ave, Anytown USA', luggageWeight: 30, price: 45.50, status: BookingStatus.CANCELLED, paymentStatus: 'Pending', qrToken: 'qr_b5_secret', createdAt: new Date(Date.now() - 259200000).toISOString() },
];

const payments: Payment[] = [
    { id: 'p1', bookingId: 'b1', amount: 25.50, method: 'Credit Card', status: 'Paid', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'p3', bookingId: 'b3', amount: 18.75, method: 'PayPal', status: 'Paid', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

// --- Mock API Functions ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchUserBookings = async (userId: string): Promise<Booking[]> => {
    await delay(500);
    return bookings.filter(b => b.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const fetchBookingDetails = async (bookingId: string): Promise<Booking> => {
    await delay(300);
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    return booking;
};

export const createBooking = async (newBookingData: Omit<Booking, 'id' | 'bookingCode' | 'status' | 'qrToken' | 'createdAt' | 'paymentStatus'>): Promise<Booking> => {
    await delay(800);
    const newBooking: Booking = {
        ...newBookingData,
        id: `b${bookings.length + 1}`,
        bookingCode: `LKNG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        status: BookingStatus.CREATED,
        paymentStatus: 'Pending',
        qrToken: `qr_b${bookings.length + 1}_secret`,
        createdAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    return newBooking;
};

export const processPayment = async (bookingId: string): Promise<boolean> => {
    await delay(1500); // Simulate payment gateway processing time
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.paymentStatus = 'Paid';
        // Add a corresponding payment record for consistency
        const newPayment: Payment = {
            id: `p${payments.length + 1}`,
            bookingId: booking.id,
            amount: booking.price,
            method: 'Mocked Card',
            status: 'Paid',
            createdAt: new Date().toISOString(),
        };
        payments.push(newPayment);
        return true;
    }
    return false;
};


export const fetchUserPayments = async (userId: string): Promise<Payment[]> => {
    await delay(500);
    const userBookingIds = bookings.filter(b => b.userId === userId).map(b => b.id);
    return payments.filter(p => userBookingIds.includes(p.bookingId));
};

export const fetchAgentBookings = async (agentId: string): Promise<Booking[]> => {
    await delay(500);
    // Return assigned but not delivered bookings
    return bookings.filter(b => (b.agentId === agentId || (b.status === BookingStatus.CREATED && !b.agentId)) && b.status !== BookingStatus.DELIVERED && b.status !== BookingStatus.CANCELLED)
    .sort((a, b) => a.status === BookingStatus.ASSIGNED ? -1 : 1); // Show assigned first
};

export const fetchAgentStats = async (agentId: string): Promise<AgentStats> => {
    await delay(400);
    return {
        todayEarnings: 44.25,
        rating: 4.8,
        weeklyEarnings: [
            { day: 'Mon', earnings: 75 }, { day: 'Tue', earnings: 120 }, { day: 'Wed', earnings: 95 },
            { day: 'Thu', earnings: 150 }, { day: 'Fri', earnings: 180 }, { day: 'Sat', earnings: 210 },
            { day: 'Sun', earnings: 130 },
        ],
        weeklyDeliveries: [
            { day: 'Mon', deliveries: 3 }, { day: 'Tue', deliveries: 5 }, { day: 'Wed', deliveries: 4 },
            { day: 'Thu', deliveries: 6 }, { day: 'Fri', deliveries: 7 }, { day: 'Sat', deliveries: 8 },
            { day: 'Sun', deliveries: 5 },
        ]
    };
};

export const verifyQRCode = async (bookingId: string, qrToken: string): Promise<boolean> => {
    await delay(1000);
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.qrToken === qrToken) {
        booking.status = BookingStatus.PICKUP_STARTED;
        booking.pickupTimestamp = new Date().toISOString();
        setTimeout(() => {
            booking.status = BookingStatus.IN_TRANSIT;
        }, 3000); // Simulate driving off
        return true;
    }
    return false;
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<Booking> => {
    await delay(500);
    const booking = bookings.find(b => b.id === bookingId);
    if(!booking) throw new Error('Booking not found');
    booking.status = status;
    if(status === BookingStatus.DELIVERED) {
      booking.deliveryTimestamp = new Date().toISOString();
    }
    return booking;
}

export const acceptBooking = async (bookingId: string, agentId: string): Promise<Booking> => {
    await delay(500);
    const booking = bookings.find(b => b.id === bookingId);
    if(!booking) throw new Error('Booking not found');
    if(booking.agentId) throw new Error('Booking already assigned');
    
    booking.agentId = agentId;
    booking.status = BookingStatus.ASSIGNED;
    const agent = users.find(u => u.id === agentId);
    booking.agent = {
        id: agent!.id,
        name: agent!.name,
        phone: '555-987-6543',
        rating: 4.9,
        vehicle: 'Ford Transit',
        verified: true,
    }
    return booking;
}

export const fetchAdminOverview = async (): Promise<AdminOverview> => {
    await delay(600);
    return {
        totalUsers: users.filter(u => u.role === Role.USER).length,
        totalAgents: users.filter(u => u.role === Role.AGENT).length,
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((sum, b) => b.paymentStatus === 'Paid' ? sum + b.price : sum, 0),
        unverifiedAgents: users.filter(u => u.role === Role.AGENT && !u.verified).length,
        issues: 3, // Mocked value
    };
};

export const fetchAllUsers = async (): Promise<User[]> => {
    await delay(500);
    return users.sort((a,b) => (a.role > b.role) ? 1 : -1);
}

export const fetchAllBookings = async (): Promise<Booking[]> => {
    await delay(500);
    return bookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const verifyAgent = async (agentId: string): Promise<User> => {
    await delay(700);
    const agent = users.find(u => u.id === agentId);
    if (!agent || agent.role !== Role.AGENT) throw new Error("Agent not found");
    agent.verified = true;
    return agent;
};
