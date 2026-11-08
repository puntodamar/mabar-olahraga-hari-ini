"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    AdminCommunity,
    AdminCommunityInput,
    CommunityTypeOption,
} from "@/src/types/AdminCommunity";

interface CommunityFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    community: AdminCommunity | null;
    onSaved: () => void;
}

export default function CommunityFormDialog({
    open,
    onOpenChange,
    community,
    onSaved,
}: CommunityFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-x-visible overflow-y-visible">
                <CommunityForm
                    key={community?.id ?? "new"}
                    community={community}
                    onSaved={onSaved}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

function CommunityForm({
    community,
    onSaved,
    onClose,
}: {
    community: AdminCommunity | null;
    onSaved: () => void;
    onClose: () => void;
}) {
    const [types, setTypes] = useState<CommunityTypeOption[]>([]);

    const [name, setName] = useState(community?.name ?? "");
    const [image, setImage] = useState(community?.image ?? "");
    const [whatsapp, setWhatsapp] = useState(community?.community_contacts?.whatsapp ?? "");
    const [instagram, setInstagram] = useState(community?.community_contacts?.instagram ?? "");
    const [tiktok, setTiktok] = useState(community?.community_contacts?.tiktok ?? "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        fetch("/api/community-types")
            .then((response) => (response.ok ? response.json() : []))
            .then((data) => {
                if (!active) return;
                setTypes(data);
            })
            .catch((e) => console.error(e));

        return () => {
            active = false;
        };
    }, []);

    // type is hardcoded to badminton for now
    const badminton = types.find((type) =>
        type.name?.toLowerCase().includes("badminton")
    );
    const communityTypeId = badminton?.id ?? community?.community_type_id ?? null;

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Nama komunitas wajib diisi.");
            return;
        }

        if (
            !community &&
            [whatsapp, instagram, tiktok].every((value) => value.trim() === "")
        ) {
            setError("Minimal satu kontak (WhatsApp/Instagram/TikTok) wajib diisi.");
            return;
        }

        const payload: AdminCommunityInput = {
            name: name.trim(),
            image: image.trim() === "" ? null : image.trim(),
            community_type_id: communityTypeId,
            contacts: {
                whatsapp: whatsapp.trim() === "" ? null : whatsapp.trim(),
                instagram: instagram.trim() === "" ? null : instagram.trim(),
                tiktok: tiktok.trim() === "" ? null : tiktok.trim(),
            },
        };

        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                community ? `/api/admin/communities/${community.id}` : "/api/admin/communities",
                {
                    method: community ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save community");
            }

            onSaved();
            onClose();
        } catch (e) {
            console.error(e);
            setError("Gagal menyimpan komunitas. Silakan coba lagi.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{community ? "Ubah Komunitas" : "Tambah Komunitas"}</DialogTitle>
                <DialogDescription>
                    {community
                        ? "Perbarui informasi komunitas di bawah ini."
                        : "Isi informasi komunitas baru di bawah ini."}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field required>
                            <FieldLabel htmlFor="name">Nama</FieldLabel>
                            <Input
                                id="name"
                                placeholder="Contoh: PB. Badminton Jaya"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                                className="overflow-visible"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="type">Tipe</FieldLabel>
                            <Input
                                id="type"
                                value="Badminton"
                                readOnly
                                disabled
                            />
                        </Field>

                        {/*<Field className="md:col-span-2">*/}
                        {/*    <FieldLabel htmlFor="image">Gambar (URL)</FieldLabel>*/}
                        {/*    <Input*/}
                        {/*        id="image"*/}
                        {/*        type="url"*/}
                        {/*        placeholder="https://..."*/}
                        {/*        value={image}*/}
                        {/*        onChange={(event) => setImage(event.target.value)}*/}
                        {/*    />*/}
                        {/*</Field>*/}

                        <Field>
                            <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
                            <Input
                                id="whatsapp"
                                placeholder="6281234567890"
                                value={whatsapp}
                                onChange={(event) => setWhatsapp(event.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
                            <Input
                                id="instagram"
                                placeholder="username"
                                value={instagram}
                                onChange={(event) => setInstagram(event.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="tiktok">TikTok</FieldLabel>
                            <Input
                                id="tiktok"
                                placeholder="username"
                                value={tiktok}
                                onChange={(event) => setTiktok(event.target.value)}
                            />
                        </Field>
                    </div>

                    <p className="min-h-5 text-sm text-destructive" aria-live="polite">
                        {error}
                    </p>
                </FieldGroup>

                <DialogFooter className="mt-4">
                    <DialogClose render={<Button variant="outline" type="button" />}>
                        Batal
                    </DialogClose>
                    <Button type="submit" disabled={saving}>
                        {saving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </form>
        </>
    );
}
