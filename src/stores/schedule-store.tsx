import {DBScheduleList} from "@/src/types/DBScheduleList";
import {create} from "zustand";

interface ScheduleStore {
    schedules: DBScheduleList[];
    setSchedules: (schedules: DBScheduleList[]) => void;
    getSchedules: () => DBScheduleList[];
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
    schedules: [],
    setSchedules: (schedules: DBScheduleList[]) => set({ schedules }),
    getSchedules: () => get().schedules,
}));