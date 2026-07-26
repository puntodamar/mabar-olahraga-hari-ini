import { create } from "zustand";
import { DBVenue } from "@/src/types/DBVenue";
import {Schedule} from "@/src/mappers/schedule-mapper";

export interface LatLng {
    lat: number;
    lng: number;
}

interface VenueStore {
    selectedVenue: DBVenue | null;
    setSelectedVenue: (place: DBVenue) => void;
    clearSelectedVenue: () => void;

    userLocation: LatLng | null;
    setUserLocation: (location: LatLng | null) => void;
    getUserLocation: () => LatLng | null;
}

export const useVenueStore = create<VenueStore>((set, get) => ({
    selectedVenue: null,
    selectedVenueSchedules: [],
    userLocation: null,

    setUserLocation: (location: LatLng | null) =>
        set({ userLocation: location }),

    setSelectedVenue: function(place: DBVenue) {
        if (get().selectedVenue?.id !== place?.id) {
            set({
                selectedVenue: place,
                // selectedVenueSchedules: schedules,
            });
        }
    },

    getUserLocation: () => get().userLocation,

    clearSelectedVenue: () =>
        set({
            selectedVenue: null,
        }),
}));