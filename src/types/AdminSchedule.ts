export interface AdminScheduleCommunity {
    id: number;
    name: string | null;
}

export interface AdminSchedulePlace {
    id: number;
    name: string;
}

export interface AdminSchedule {
    id: number;
    day: number;
    time_start: string;
    time_end: string;
    fee: number | null;
    level: number | null;
    gender: number | null;
    scoring: number | null;
    courts: number | null;
    additional_info: string | null;
    community: AdminScheduleCommunity | null;
    place: AdminSchedulePlace | null;
}

export interface AdminScheduleInput {
    community_id: number;
    venue_id: number;
    day: number;
    time_start: string;
    time_end: string;
    fee: number | null;
    level: number | null;
    gender: number | null;
    scoring: number | null;
    courts: number | null;
    additional_info: string | null;
}
