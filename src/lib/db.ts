import { mockUsers, mockListings, mockBookings, User, ContainerListing, Booking } from './data';

class Database {
  users: User[] = [...mockUsers];
  listings: ContainerListing[] = [...mockListings];
  bookings: Booking[] = [...mockBookings];
}

// Global instance to persist across API route calls in development
const globalForDb = global as unknown as { db: Database };

export const db = globalForDb.db || new Database();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
