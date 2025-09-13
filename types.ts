export enum Role {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
  verified?: boolean; // For agents
}

export enum BookingStatus {
  CREATED = 'Created',
  ASSIGNED = 'Assigned',
  PICKUP_STARTED = 'Pickup Started',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export const bookingStatusSteps = [
  BookingStatus.CREATED,
  BookingStatus.ASSIGNED,
  BookingStatus.PICKUP_STARTED,
  BookingStatus.IN_TRANSIT,
  BookingStatus.DELIVERED,
];

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  agentId?: string;
  pickupAddress: string;
  dropAddress: string;
  luggageWeight: number;
  price: number;
  status: BookingStatus;
  paymentStatus: 'Paid' | 'Pending';
  qrToken: string;
  createdAt: string;
  pickupTimestamp?: string;
  deliveryTimestamp?: string;
  agent?: AgentInfo;
}

export interface AgentInfo {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    verified: boolean;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Pending';
  createdAt: string;
}

export interface AgentStats {
    todayEarnings: number;
    rating: number;
    weeklyEarnings: { day: string; earnings: number }[];
    weeklyDeliveries: { day: string; deliveries: number }[];
}

export interface AdminOverview {
    totalUsers: number;
    totalAgents: number;
    totalBookings: number;
    totalRevenue: number;
    unverifiedAgents: number;
    issues: number;
}