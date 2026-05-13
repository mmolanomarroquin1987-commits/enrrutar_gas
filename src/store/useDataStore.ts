import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RouteRecord {
  id: string; // The ID from the form
  uniqueId: string; // Internal unique ID
  date: string;
  correctRoute: string;
  meter: string;
  cycle: string;
  neighborhoodCode: string;
  observations: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  photoBase64: string | null;
  syncedAt: string;
}

export interface UserRecord {
  id: string;
  uniqueId: string;
  date: string;
  fullName: string;
  meter: string;
  phone: string;
  address: string;
  neighborhood: string;
  municipality: string;
  observations: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  photoBase64: string | null;
  syncedAt: string;
}

interface DataState {
  routes: RouteRecord[];
  users: UserRecord[];
  addRoute: (route: RouteRecord) => void;
  addUser: (user: UserRecord) => void;
  deleteRoute: (uniqueId: string) => void;
  deleteUser: (uniqueId: string) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      routes: [],
      users: [],
      addRoute: (route) =>
        set((state) => ({ routes: [route, ...state.routes] })),
      addUser: (user) =>
        set((state) => ({ users: [user, ...state.users] })),
      deleteRoute: (uniqueId) =>
        set((state) => ({
          routes: state.routes.filter((r) => r.uniqueId !== uniqueId),
        })),
      deleteUser: (uniqueId) =>
        set((state) => ({
          users: state.users.filter((u) => u.uniqueId !== uniqueId),
        })),
    }),
    {
      name: 'mobatos-data-storage',
    }
  )
);
