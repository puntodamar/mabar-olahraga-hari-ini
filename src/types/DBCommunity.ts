import {DBCommunityContact} from "@/src/types/DBCommunityContact";
import {DBCommunityType} from "@/src/types/DBCommunityType";

export interface DBCommunity {
    id: number;
    name: string;
    image: string | null;
    type: DBCommunityType | null;
    contacts: DBCommunityContact | null;
}