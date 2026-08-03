import { create } from "zustand";

interface LatLng {
    lat: number;
    lng: number;
}

interface MapStore {
    geolocation: PermissionState | null;
    lastKnownLocation: LatLng | null;
    setGeolocation: (state: PermissionState | null) => void;
    getPermissionState: () => Promise<PermissionState | null>;
    getUserLocation: () => Promise<LatLng>;
    getLastKnownLocation: () => LatLng | null;
    setLastKnownLocation: (location: LatLng) => void;
}

export const usePermissionStore = create<MapStore>((set, get) => ({
    geolocation: null,
    lastKnownLocation: null,

    setGeolocation: (state) => set({ geolocation: state }),
    setLastKnownLocation: (location) => set({ lastKnownLocation: location }),

    getPermission: () => get().geolocation,

    getPermissionState: async () => {
        if (!("permissions" in navigator)) {
            set({ geolocation: null });
            return null;
        }

        try {
            const permission = await navigator.permissions.query({
                name: "geolocation",
            });

            set({ geolocation: permission.state });

            return permission.state;
        } catch {
            set({ geolocation: null });
            return null;
        }
    },

    getUserLocation: () =>
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) =>
                    resolve({
                        lat: coords.latitude,
                        lng: coords.longitude,
                    }),
                reject,
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 5 * 60 * 1000,
                }
            );
        }),

    getLastKnownLocation: () => get().lastKnownLocation
}));