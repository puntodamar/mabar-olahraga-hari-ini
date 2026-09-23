'use client';

import { useState, useEffect } from 'react';
import {MonitorSmartphoneIcon} from "lucide-react";

export default function InstallButton({className}: {className?: string}) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isBrowserInstallable, setIsBrowserInstallable] = useState(false);

    // MANUAL OVERRIDE: Set to true if you want to force-preview the button in dev mode
    const [manualOverride, setManualOverride] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsBrowserInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setDeferredPrompt(null);
        } else {
            alert('Manual Override Mode: Real browser install prompt is not active right now.');
        }
    };

    const showButton = isBrowserInstallable || manualOverride;

    if (!showButton) return null;

    return (
        <button onClick={handleInstallClick} className={`hover:cursor-pointer flex flex-row items-center gap-x-2 font-normal bg-primary text-white text-sm px-4 py-2 rounded-md shadow-lg z-50 ${className}`}>
            <span className="text-xs md:text-sm">Install ke Home Screen</span>
            <MonitorSmartphoneIcon className="w-5 h-5" />
        </button>
    );
}
