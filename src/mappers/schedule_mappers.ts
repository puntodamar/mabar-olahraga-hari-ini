import {DBScheduleList} from "@/src/types/DBScheduleList";
import {Day} from "@/src/types/enums/Day";
import {Level} from "@/src/types/enums/Level";
import {Gender} from "@/src/types/enums/Gender";
import {DBPlace} from "@/src/types/DBPlace";
import {DBCommunity} from "@/src/types/DBCommunity";

export interface Schedule {
    id: number;
    day: string;
    timeStart: string;
    timeEnd: string;
    fee: string | null;
    level: string | null;
    gender: string | null;
    courts: string | null;
    additionalInfo: string | null;
    community: DBCommunity;
    place: DBPlace;
}

export function toSchedule(db: DBScheduleList): Schedule {
    return {
        id: db.id,
        day: Day[db.day],
        timeStart: db.time_start.slice(0, 5),
        timeEnd: db.time_end.slice(0, 5),
        fee: db.fee == null ? null : `${db.fee}rb`,
        level: db.level == null ? '-' : Level[db.level],
        gender: db.gender == null ? '-' : Gender[db.gender],
        courts: db.courts == null ? '-' : `${db.courts} lapangan`,
        additionalInfo: db.additional_info,
        community: db.community,
        place: db.place,
    };
}