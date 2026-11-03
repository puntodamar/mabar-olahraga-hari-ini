import { create } from "zustand";
import { DBScheduleList } from "@/src/types/DBScheduleList";

interface ScheduleStore {
    init: boolean;
    loading: boolean;
    error: string | null;
    schedules: DBScheduleList[];

    setInit: (init: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSchedules: (schedules: DBScheduleList[]) => void;

    fetchSchedules: (query?: string, location?: LatLng | null) => Promise<void>;
}

// Only the newest request may write state, so an earlier (unlocated) response
// can never overwrite a later one.
let latestRequestId = 0;

export const useScheduleStore = create<ScheduleStore>((set) => ({
    init: true,
    loading: false,
    error: null,
    schedules: [],

    setInit: (init) => set({ init }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSchedules: (schedules) => set({ schedules }),

    fetchSchedules: async (query = "", location) => {
        const requestId = ++latestRequestId;

        try {
            set({
                loading: true,
                error: null,
            });

            const params = new URLSearchParams(query.replace(/^\?/, ""));
            if (location?.lat != null) params.set("lat", String(location.lat));
            if (location?.lng != null) params.set("lng", String(location.lng));

            const endpoint = params.toString()
                ? `/api/schedules?${params.toString()}`
                : "/api/schedules";

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`Error fetching schedules: ${response.status} ${response.statusText}`);
            }

            const schedules: DBScheduleList[] = await response.json();

            if (requestId !== latestRequestId) return;

            set({
                schedules,
                loading: false,
                init: false,
            });
        } catch (e) {
            console.error(e);

            if (requestId !== latestRequestId) return;

            set({
                loading: false,
                init: false,
                error:
                    "Gagal memuat database jadwal. Silakan coba beberapa saat lagi.",
            });
        }
    },
}));