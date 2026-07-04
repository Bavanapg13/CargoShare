export type Role = 'trader' | 'lsp' | 'admin';

export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  password?: string; // Mock only
  phone?: string;
  // Trader specific
  companyName?: string;
  gstNumber?: string;
  // LSP specific
  transportMode?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  inspectionNotes?: string;
};

export type ContainerListing = {
  id: string;
  lspId: string;
  lspName: string;
  lspVerified: boolean;
  mode: 'road' | 'rail' | 'ship' | 'air';
  origin: string;
  destination: string;
  departureDate: string;
  containerType: string;
  containerSize: string;
  availableVolume: number; // cubic meters
  availableWeight: number; // kg
  pricePerKg: number;
  estimatedTransitTime: string;
  status: 'Available' | 'Almost Full' | 'Booked Out' | 'In Transit';
};

export type Booking = {
  id: string;
  listingId: string;
  traderId: string;
  lspId: string;
  status: 'Requested' | 'Confirmed' | 'Paid' | 'Cancelled' | 'Completed';
  weight: number;
  volume: number;
  totalPrice: number;
  date: string;
  origin: string;
  destination: string;
};

export const mockUsers: User[] = [
  { id: 'u1', role: 'admin', name: 'Admin', email: 'admin@cargoshare.com', password: 'password' },
  { 
    id: 'u2', role: 'lsp', name: 'Global Freight Logistics', email: 'contact@globalfreight.com', password: 'password',
    status: 'approved', transportMode: ['ship', 'air'], companyName: 'Global Freight Ltd'
  },
  { 
    id: 'u3', role: 'lsp', name: 'Speedy Roadways', email: 'info@speedyroad.com', password: 'password',
    status: 'pending', transportMode: ['road'], companyName: 'Speedy Roadways Inc'
  },
  { 
    id: 'u4', role: 'trader', name: 'John Exporter', email: 'john@export.com', password: 'password',
    companyName: 'John Goods', gstNumber: 'GST12345'
  },
];

export const mockListings: ContainerListing[] = [
  {
    id: 'l1',
    lspId: 'u2',
    lspName: 'Global Freight Logistics',
    lspVerified: true,
    mode: 'ship',
    origin: 'Mumbai Port, India',
    destination: 'Rotterdam Port, NL',
    departureDate: '2026-06-01',
    containerType: 'Refrigerated',
    containerSize: '40ft High Cube',
    availableVolume: 15.5,
    availableWeight: 5000,
    pricePerKg: 2.5,
    estimatedTransitTime: '22 Days',
    status: 'Available'
  },
  {
    id: 'l2',
    lspId: 'u2',
    lspName: 'Global Freight Logistics',
    lspVerified: true,
    mode: 'air',
    origin: 'Delhi IGI, India',
    destination: 'London LHR, UK',
    departureDate: '2026-05-20',
    containerType: 'Standard Pallet',
    containerSize: 'LD3 Container',
    availableVolume: 3.2,
    availableWeight: 800,
    pricePerKg: 15.0,
    estimatedTransitTime: '14 Hours',
    status: 'Almost Full'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    listingId: 'l1',
    traderId: 'u4',
    lspId: 'u2',
    status: 'Confirmed',
    weight: 1000,
    volume: 3,
    totalPrice: 2500,
    date: '2026-05-16',
    origin: 'Mumbai Port, India',
    destination: 'Rotterdam Port, NL'
  }
];
