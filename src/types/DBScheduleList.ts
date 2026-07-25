import {DBCommunity} from "@/src/types/DBCommunity";
import {DBPlace} from "@/src/types/DBPlace";
import {Level} from "@/src/types/enums/Level";
import {Gender} from "@/src/types/enums/Gender";
import {Day} from "@/src/types/enums/Day";

export interface DBScheduleList {
    id: number;
    day: number;
    time_start: string;
    time_end: string;
    fee: number | null;
    level: number | null;
    gender: number | null;
    courts: number | null;
    additional_info: string | null;
    community: DBCommunity;
    place: DBPlace;
}