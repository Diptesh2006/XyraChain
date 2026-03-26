
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HospitalFinder() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'denied'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Auto-request location on mount
        requestLocation();
    }, []);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setStatus('error');
            setErrorMessage('Geolocation is not supported by your browser.');
            return;
        }

        setStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setStatus('success');
            },
            (error) => {
                console.error("Error getting location:", error);
                if (error.code === error.PERMISSION_DENIED) {
                    setStatus('denied');
                } else {
                    setStatus('error');
                    setErrorMessage(error.message);
                }
            }
        );
    };

    return (
        <div className="text-stone-500 antialiased min-h-screen flex flex-col selection:bg-emerald-200 selection:text-emerald-900 bg-[#FDFBF7] dark:bg-[#030303] dark:text-stone-400 transition-colors duration-300">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-medium text-stone-800 dark:text-white tracking-tight mb-4 transition-colors">
                            Find Nearby Care
                        </h1>
                        <p className="text-stone-500 dark:text-stone-400 transition-colors">
                            Locate the nearest hospitals and medical specialists based on your current location.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm min-h-[600px] relative dark:bg-[#0a0a0a] dark:border-white/10 transition-colors">

                        {status === 'loading' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50/50 dark:bg-black/50 backdrop-blur-sm z-10">
                                <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mb-4"></div>
                                <p className="text-stone-600 dark:text-stone-300 font-medium">Acquiring your location...</p>
                            </div>
                        )}

                        {status === 'denied' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-stone-50 dark:bg-[#0a0a0a]">
                                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 dark:bg-rose-500/10 dark:text-rose-400">
                                    <iconify-icon icon="solar:map-point-remove-bold" width="32"></iconify-icon>
                                </div>
                                <h3 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">Location Access Denied</h3>
                                <p className="text-stone-500 dark:text-stone-400 max-w-md mb-6">
                                    We need access to your location to show nearby hospitals. Please enable location services in your browser settings.
                                </p>
                                <button
                                    onClick={requestLocation}
                                    className="px-6 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-stone-50 dark:bg-[#0a0a0a]">
                                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 dark:bg-rose-500/10 dark:text-rose-400">
                                    <iconify-icon icon="solar:danger-circle-bold" width="32"></iconify-icon>
                                </div>
                                <h3 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">Location Error</h3>
                                <p className="text-stone-500 dark:text-stone-400 max-w-md mb-6">
                                    {errorMessage || "Unable to determine your location. Please try searching manually."}
                                </p>
                                <button
                                    onClick={requestLocation}
                                    className="px-6 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {status === 'success' && location && (
                            <div className="w-full h-[600px] bg-stone-100 dark:bg-[#111] relative group">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=Hospitals&ll=${location.lat},${location.lng}&z=14&output=embed`}
                                    allowFullScreen
                                    allow="geolocation"
                                    title="Nearby Hospitals"
                                    className="grayscale-[20%] dark:invert-[90%] dark:hue-rotate-180 transition-all duration-700"
                                ></iframe>



                                {/* Controls Overlay */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-stone-200 dark:border-white/10 text-xs shadow-lg pointer-events-auto max-w-xs transition-colors">
                                        <p className="text-stone-600 dark:text-stone-300 font-medium mb-1 flex items-center gap-2">
                                            <iconify-icon icon="solar:info-circle-bold" width="16" className="text-blue-500"></iconify-icon>
                                            Map Center
                                        </p>
                                        <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
                                            The map is centered on your current coordinates. Pan to search nearby areas.
                                        </p>
                                        <button
                                            onClick={requestLocation}
                                            className="w-full py-2 bg-stone-100 hover:bg-stone-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-stone-600 dark:text-stone-300 text-xs font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <iconify-icon icon="solar:restart-bold" width="14"></iconify-icon>
                                            Re-center Map
                                        </button>
                                    </div>

                                    <a
                                        href={`https://www.google.com/maps/search/Hospitals/@${location.lat},${location.lng},14z`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pointer-events-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <span>Open in Google Maps App</span>
                                        <iconify-icon icon="solar:arrow-right-up-linear" width="16"></iconify-icon>
                                    </a>
                                </div>
                            </div>
                        )}

                        {status === 'idle' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                <p>Initializing map...</p>
                            </div>
                        )}

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
