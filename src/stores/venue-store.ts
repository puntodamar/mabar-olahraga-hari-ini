import { create } from "zustand";
import { DBVenue } from "@/src/types/DBVenue";

export interface LatLng {
    lat: number;
    lng: number;
}

interface VenueStore {
    selectedVenue: DBVenue | null;
    setSelectedVenue: (place: DBVenue) => void;
    clearSelectedVenue: () => void;
}

export const useVenueStore = create<VenueStore>((set, get) => ({
    selectedVenue: null,
    selectedVenueSchedules: [],

    setSelectedVenue: function(place: DBVenue) {
        if (get().selectedVenue?.id !== place?.id) {
            set({
                selectedVenue: place,
                // selectedVenueSchedules: schedules,
            });
        }
    },


    clearSelectedVenue: () =>
        set({
            selectedVenue: null,
        }),
}));