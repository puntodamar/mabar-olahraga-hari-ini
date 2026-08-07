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
        const controller = new AbortController();

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

            const response = await fetch(
                endpoint,
                {
                    signal: controller.signal,
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching schedules: ${response.status} ${response.statusText}`);
            }

            const schedules: DBScheduleList[] = await response.json();

            set({
                schedules,
                loading: false,
                init: false,
            });
        } catch (e) {
            if (e instanceof DOMException && e.name === "AbortError") {
                return;
            }

            console.error(e);

            set({
                loading: false,
                init: false,
                error:
                    "Gagal memuat database jadwal. Silakan coba beberapa saat lagi.",
            });
        }
    },
}));