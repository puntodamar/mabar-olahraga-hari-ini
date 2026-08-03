import {DBScheduleList} from "@/src/types/DBScheduleList";
import {create} from "zustand";

interface ScheduleStore {
    init: boolean;
    schedules: DBScheduleList[];
    loading: boolean;
    setSchedules: (schedules: DBScheduleList[]) => void;
    setLoading: (loading: boolean) => void;
    getSchedules: () => DBScheduleList[];
    getLoading: () => boolean;
    getInit: () => boolean;
    setInit: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
    schedules: [],
    init: true,
    loading: false,
    getInit: () => get().init,
    setInit: () => set({ init: false }),
    setSchedules: (schedules: DBScheduleList[]) => set({ schedules }),
    setLoading: (loading: boolean) => set({ loading }),
    getSchedules: () => get().schedules,
    getLoading: () => get().loading,
}));