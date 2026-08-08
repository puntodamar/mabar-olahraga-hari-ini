import {DBScheduleList} from "@/src/types/DBScheduleList";
import {Day} from "@/src/types/enums/Day";
import {Level} from "@/src/types/enums/Level";
import {Gender} from "@/src/types/enums/Gender";
import {DBVenue} from "@/src/types/DBVenue";
import {DBCommunity} from "@/src/types/DBCommunity";
import {ScoringLabel} from "@/src/consts/filter";

export interface Schedule {
    id: number;
    day: string;
    timeStart: string;
    timeEnd: string;
    fee: string | null;
    level: string | null;
    gender: string | null;
    courts: string | null;
    scoring: string | null;
    additionalInfo: string | null;
    community: DBCommunity;
    place: DBVenue;
    distance_meters: number | null,
}

export function toSchedule(db: DBScheduleList): Schedule {

    const community: DBCommunity = {
        id: db.community.id,
        name: `PB. ${db.community.name}`,
        image: db.community.image == null ? `images/icons/${db.community.type}.svg` : db.community.image,
        type: db.community.type,
        contacts: db.community.contacts,
    }

    return {
        id: db.id,
        day: Day[db.day],
        timeStart: db.time_start.slice(0, 5),
        timeEnd: db.time_end.slice(0, 5),
        fee: db.fee == null || db.fee === 0 ? '-' : `${db.fee}rb`,
        level: db.level == null ? '-' : Level[db.level],
        gender: db.gender == null ? 'mix' : Gender[db.gender],
        courts: db.courts == null ? '-' : `${db.courts} lapangan`,
        additionalInfo: db.additional_info,
        community: community,
        place: db.place,
        scoring: db.scoring != null ? ScoringLabel[db.scoring].label : '-',
        distance_meters: db.distance_meters,
    }
}