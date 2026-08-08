import { create } from "zustand";
import { DBVenue } from "@/src/types/DBVenue";
import {Schedule} from "@/src/mappers/schedule-mapper";

export interface LatLng {
    lat: number;
    lng: number;
}

interface VenueStore {
    selectedVenue: DBVenue | null;
    venues: DBVenue[] | null;
    selectedSchedule: Schedule | null;
    setSelectedVenue: (place: DBVenue) => void;
    clearSelectedVenue: () => void;
    setSelectedSchedule: (schedule: Schedule) => void;
    setVenues: (venues: DBVenue[]) => void;
}

export const useVenueStore = create<VenueStore>((set, get) => ({
    selectedVenue: null,
    selectedSchedule: null,
    venues: null,

    setVenues: (venues: DBVenue[]) => {
        set({ venues });
    },

    setSelectedSchedule: (schedule: Schedule) => {
        set({ selectedSchedule: schedule });
    },

    setSelectedVenue: function(place: DBVenue) {

        if (get().selectedVenue?.id !== place.id) {

            set({
                selectedVenue: place,
            });
        }
    },


    clearSelectedVenue: () =>
        set({
            selectedVenue: null,
        }),
}));