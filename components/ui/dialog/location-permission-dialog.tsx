import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {DialogTrigger} from "@base-ui/react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAllow: () => void;
};

export function LocationPermissionDialog({
                                             open,
                                             onOpenChange,
                                             onAllow,
                                         }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Aktifkan Lokasi</DialogTitle>

    <DialogDescription>
        Kami membutuhkan izin lokasi untuk menampilkan lokasi mabar terdekat dengan Anda. Silakan aktifkan izin lokasi untuk melanjutkan.
    </DialogDescription>
    </DialogHeader>

    <DialogFooter>

    <Button
    onClick={onAllow}
        >
        Aktifkan Lokasi
    </Button>
    </DialogFooter>
    </DialogContent>
    </Dialog>
);
}

