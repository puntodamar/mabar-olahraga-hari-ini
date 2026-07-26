import {DBCommunity} from "@/src/types/DBCommunity";
import {DBVenue} from "@/src/types/DBVenue";

export interface DBScheduleList {
    id: number;
    day: number;
    type: string;
    time_start: string;
    time_end: string;
    fee: number | null;
    level: number | null;
    gender: number | null;
    courts: number | null;
    additional_info: string | null;
    community: DBCommunity;
    place: DBVenue;
}