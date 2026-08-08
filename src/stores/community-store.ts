import {DBCommunity} from "@/src/types/DBCommunity";
import {create} from "zustand";

interface CommunityStore {
    communities: DBCommunity[];
    setCommunities: (communities: DBCommunity[]) => void;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
    communities: [],
    setCommunities: (communities: DBCommunity[]) => {
        set({ communities });
    }
}));