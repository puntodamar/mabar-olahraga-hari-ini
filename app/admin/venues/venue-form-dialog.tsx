"use client";

import { useState } from "react";
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
import { AdminVenue } from "./columns";

interface VenueFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venue: AdminVenue | null;
    onSaved: () => void;
}

interface VenueInput {
    name: string;
    map_url?: string | null;
}

export default function VenueFormDialog({
    open,
    onOpenChange,
    venue,
    onSaved,
}: VenueFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <VenueForm
                    key={venue?.id ?? "new"}
                    venue={venue}
                    onSaved={onSaved}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

function VenueForm({
    venue,
    onSaved,
    onClose,
}: {
    venue: AdminVenue | null;
    onSaved: () => void;
    onClose: () => void;
}) {
    const [name, setName] = useState(venue?.name ?? "");
    const [mapUrl, setMapUrl] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Nama venue wajib diisi.");
            return;
        }

        const payload: VenueInput = {
            name: name.trim(),
        };
        if (mapUrl.trim()) {
            payload.map_url = mapUrl.trim();
        }

        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                venue ? `/api/admin/venues/${venue.id}` : "/api/admin/venues",
                {
                    method: venue ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save venue");
            }

            onSaved();
            onClose();
        } catch (e) {
            console.error(e);
            setError("Gagal menyimpan venue. Silakan coba lagi.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{venue ? "Ubah Venue" : "Tambah Venue"}</DialogTitle>
                <DialogDescription>
                    {venue
                        ? "Perbarui informasi venue di bawah ini."
                        : "Isi informasi venue baru di bawah ini."}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="grid grid-cols-1 gap-5">
                        <Field>
                            <FieldLabel htmlFor="name">Nama Venue</FieldLabel>
                            <Input
                                id="name"
                                placeholder="Contoh: GOR Badminton"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="map_url">URL Maps</FieldLabel>
                            <Input
                                id="map_url"
                                type="url"
                                placeholder="https://maps.google.com/..."
                                value={mapUrl}
                                onChange={(event) => setMapUrl(event.target.value)}
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
