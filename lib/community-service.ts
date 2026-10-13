import {unstable_cache} from "next/cache";
import {supabase} from "@/lib/supabase";
import {
    AdminCommunity,
    AdminCommunityInput,
    CommunityTypeOption,
} from "@/src/types/AdminCommunity";

export const getCommunityOptions = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from("community_list_options")
            .select("id, name");
        if (error) throw error;
        return data;
    },
    ["community_list_options"],
    {
        // revalidate: 1,
        revalidate: 3600,
    }
);

export const getCommunities = async (): Promise<AdminCommunity[]> => {
    const { data, error } = await supabase
        .from("communities")
        .select(`
            id,
            name,
            image,
            community_type_id,
            community_types ( id, name ),
            community_contacts ( whatsapp, instagram, tiktok )
        `)
        .order("name", { ascending: true });

    if (error) throw error;

    return data as unknown as AdminCommunity[];
};

export const getCommunityTypes = async (): Promise<CommunityTypeOption[]> => {
    const { data, error } = await supabase
        .from("community_types")
        .select("id, name")
        .order("name", { ascending: true });

    if (error) throw error;

    return data as CommunityTypeOption[];
};

export const createCommunity = async (payload: AdminCommunityInput) => {
    const { contacts, ...community } = payload;

    const { data, error } = await supabase
        .from("communities")
        .insert(community)
        .select()
        .single();

    if (error) throw error;

    if (contacts.whatsapp || contacts.instagram || contacts.tiktok) {
        const { error: contactError } = await supabase
            .from("community_contacts")
            .insert({ community_id: data.id, ...contacts });

        if (contactError) throw contactError;
    }

    return data;
};

export const updateCommunity = async (id: number, payload: AdminCommunityInput) => {
    const { contacts, ...community } = payload;

    const { data, error } = await supabase
        .from("communities")
        .update(community)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    const { data: existing } = await supabase
        .from("community_contacts")
        .select("id")
        .eq("community_id", id)
        .maybeSingle();

    if (contacts.whatsapp || contacts.instagram || contacts.tiktok) {
        if (existing) {
            const { error: contactError } = await supabase
                .from("community_contacts")
                .update(contacts)
                .eq("community_id", id);

            if (contactError) throw contactError;
        } else {
            const { error: contactError } = await supabase
                .from("community_contacts")
                .insert({ community_id: id, ...contacts });

            if (contactError) throw contactError;
        }
    } else if (existing) {
        const { error: deleteError } = await supabase
            .from("community_contacts")
            .delete()
            .eq("community_id", id);

        if (deleteError) throw deleteError;
    }

    return data;
};