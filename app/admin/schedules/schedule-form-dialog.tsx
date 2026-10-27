"use client";

import { useCallback, useEffect, useState } from "react";
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
import SelectFilter from "@/components/ui/filter/select-filter";
import AsyncSelectFilter from "@/components/ui/filter/async-select-filter";
import { AdminSchedule, AdminScheduleInput } from "@/src/types/AdminSchedule";
import { Day } from "@/src/types/enums/Day";
import { Level } from "@/src/types/enums/Level";
import { Gender } from "@/src/types/enums/Gender";
import { ScoringLabel } from "@/src/consts/filter";

interface CommunityOption {
    id: number;
    name: string | null;
}

interface VenueOption {
    id: number;
    name: string;
}

interface ScheduleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    schedule: AdminSchedule | null;
    onSaved: () => void;
}

const dayItems = Day.map((label, index) => ({ label, value: index + 1 }));
const levelItems = Level.map((label, index) => ({ label, value: index }));
const genderItems = Gender.map((label, index) => ({ label, value: index }));
const scoringItems = ScoringLabel.map((item, index) => ({ label: item.label, value: index }));

export default function ScheduleFormDialog({
    open,
    onOpenChange,
    schedule,
    onSaved,
}: ScheduleFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <ScheduleForm
                    key={schedule?.id ?? "new"}
                    schedule={schedule}
                    onSaved={onSaved}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

function ScheduleForm({
    schedule,
    onSaved,
    onClose,
}: {
    schedule: AdminSchedule | null;
    onSaved: () => void;
    onClose: () => void;
}) {
    const [venues, setVenues] = useState<VenueOption[]>([]);

    const [communityId, setCommunityId] = useState<number | null>(
        schedule?.community?.id ?? null
    );
    const [venueId, setVenueId] = useState<number | null>(schedule?.place?.id ?? null);
    const [day, setDay] = useState<number>(schedule?.day ?? 1);
    const [timeStart, setTimeStart] = useState(schedule?.time_start ? schedule.time_start.slice(0, 5) : "");
    const [timeEnd, setTimeEnd] = useState(schedule?.time_end ? schedule.time_end.slice(0, 5) : "");
    const [fee, setFee] = useState(schedule?.fee == null ? "" : String(schedule.fee));
    const [level, setLevel] = useState<number | null>(schedule?.level ?? null);
    const [gender, setGender] = useState<number | null>(schedule?.gender ?? null);
    const [scoring, setScoring] = useState<number | null>(schedule?.scoring ?? null);
    const [courts, setCourts] = useState(
        schedule?.courts == null ? "" : String(schedule.courts)
    );
    const [additionalInfo, setAdditionalInfo] = useState(schedule?.additional_info ?? "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchCommunities = useCallback(async (search: string) => {
        const params = new URLSearchParams()
        if (search.trim()) params.set("q", search.trim())
        const response = await fetch(`/api/admin/communities/search?${params.toString()}`)
        if (!response.ok) return []
        const data = await response.json()
        if (!Array.isArray(data)) return []
        return data.map((item: CommunityOption) => ({
            label: item.name ?? "-",
            value: item.id,
        }))
    }, [])

    useEffect(() => {
        let active = true;

        Promise.all([fetch("/api/venues")])
            .then(([venueResponse]) =>
                Promise.all([
                    venueResponse.ok ? venueResponse.json() : [],
                ])
            )
            .then(([venueData]) => {
                if (!active) return;
                setVenues(Array.isArray(venueData) ? venueData : (venueData?.data ?? []));
            })
            .catch((e) => console.error(e));

        return () => {
            active = false;
        };
    }, []);

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (communityId == null || venueId == null) {
            setError("Komunitas dan venue wajib dipilih.");
            return;
        }

        if (!timeStart || !timeEnd) {
            setError("Waktu mulai dan selesai wajib diisi.");
            return;
        }

        const payload: AdminScheduleInput = {
            community_id: communityId,
            venue_id: venueId,
            day,
            time_start: timeStart,
            time_end: timeEnd,
            fee: fee === "" ? null : Number(fee),
            level,
            gender,
            scoring,
            courts: courts === "" ? null : Number(courts),
            additional_info: additionalInfo === "" ? null : additionalInfo,
        };

        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                schedule ? `/api/admin/schedules/${schedule.id}` : "/api/admin/schedules",
                {
                    method: schedule ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save schedule");
            }

            onSaved();
            onClose();
        } catch (e) {
            console.error(e);
            setError("Gagal menyimpan jadwal. Silakan coba lagi.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{schedule ? "Ubah Jadwal" : "Tambah Jadwal"}</DialogTitle>
                <DialogDescription>
                    {schedule
                        ? "Perbarui informasi jadwal di bawah ini."
                        : "Isi informasi jadwal baru di bawah ini."}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="community">Komunitas</FieldLabel>
                            <AsyncSelectFilter
                                value={communityId}
                                onValueChange={(value) => setCommunityId(value)}
                                placeholder="Pilih komunitas"
                                searchPlaceholder="Cari komunitas..."
                                fetchItems={fetchCommunities}
                                initialItem={
                                    schedule?.community
                                        ? { label: schedule.community.name ?? "-", value: schedule.community.id }
                                        : null
                                }
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="venue">Venue</FieldLabel>
                            <SelectFilter
                                items={venues.map((venue) => ({
                                    label: venue.name,
                                    value: venue.id,
                                }))}
                                value={venueId}
                                onValueChange={setVenueId}
                                placeholder="Pilih venue"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="day">Hari</FieldLabel>
                            <SelectFilter
                                items={dayItems}
                                value={day}
                                onValueChange={(value) => setDay(value ?? 1)}
                                placeholder="Pilih hari"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="fee">Biaya (rb)</FieldLabel>
                            <Input
                                id="fee"
                                type="number"
                                min={0}
                                placeholder="Contoh: 30"
                                value={fee}
                                onChange={(event) => setFee(event.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="time_start">Waktu Mulai</FieldLabel>
                            <Input
                                id="time_start"
                                type="time"
                                value={timeStart}
                                onChange={(event) => setTimeStart(event.target.value)}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="time_end">Waktu Selesai</FieldLabel>
                            <Input
                                id="time_end"
                                type="time"
                                value={timeEnd}
                                onChange={(event) => setTimeEnd(event.target.value)}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="level">Level</FieldLabel>
                            <SelectFilter
                                items={levelItems}
                                value={level}
                                onValueChange={setLevel}
                                placeholder="Pilih level"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="gender">Gender</FieldLabel>
                            <SelectFilter
                                items={genderItems}
                                value={gender}
                                onValueChange={setGender}
                                placeholder="Pilih gender"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="scoring">Scoring</FieldLabel>
                            <SelectFilter
                                items={scoringItems}
                                value={scoring}
                                onValueChange={setScoring}
                                placeholder="Pilih scoring"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="courts">Jumlah Lapangan</FieldLabel>
                            <Input
                                id="courts"
                                type="number"
                                min={0}
                                placeholder="Contoh: 2"
                                value={courts}
                                onChange={(event) => setCourts(event.target.value)}
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="additional_info">Info Tambahan</FieldLabel>
                        <textarea
                            id="additional_info"
                            rows={3}
                            placeholder="Informasi tambahan (opsional)"
                            value={additionalInfo}
                            onChange={(event) => setAdditionalInfo(event.target.value)}
                            className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                    </Field>

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
