export interface AdminCommunityContacts {
    whatsapp: string | null;
    instagram: string | null;
    tiktok: string | null;
}

export interface AdminCommunity {
    id: number;
    name: string | null;
    image: string | null;
    community_type_id: number | null;
    community_types: { id: number; name: string } | null;
    community_contacts: AdminCommunityContacts | null;
}

export interface AdminCommunityInput {
    name: string;
    image: string | null;
    community_type_id: number | null;
    contacts: AdminCommunityContacts;
}

export interface CommunityTypeOption {
    id: number;
    name: string;
}
