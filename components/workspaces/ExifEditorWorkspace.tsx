'use client';

import NextImage from 'next/image';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { DateTime } from 'luxon';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import exifr from 'exifr';
import piexif from 'piexifjs';
import { getTimeZones } from '@vvo/tzdb';
import 'leaflet/dist/leaflet.css';
import type * as Leaflet from 'leaflet';
import { ChevronDownIcon } from '../icons';

type TimezoneOption = {
    value: string;
    label: string;
};

const tzDatabaseZones = getTimeZones({ includeUtc: true });

const formatOffsetMinutes = (offsetMinutes: number) => {
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absoluteMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absoluteMinutes / 60)
        .toString()
        .padStart(2, '0');
    const minutes = (absoluteMinutes % 60).toString().padStart(2, '0');

    return `${sign}${hours}:${minutes}`;
};

const timezoneOptions: TimezoneOption[] = tzDatabaseZones
    .map((zone) => {
        const formattedOffset = formatOffsetMinutes(zone.currentTimeOffsetInMinutes);

        return {
            value: zone.name,
            label: `${zone.name} (UTC${formattedOffset})`,
        };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

const uniqueOffsets = Array.from(
    new Set(tzDatabaseZones.map((zone) => formatOffsetMinutes(zone.currentTimeOffsetInMinutes)))
).sort();

const isoOffsetOptions: TimezoneOption[] = uniqueOffsets.map((offset) => ({
    value: `UTC${offset}`,
    label: `UTC${offset}`,
}));

const timezoneSuggestions: TimezoneOption[] = [...isoOffsetOptions, ...timezoneOptions];

const getZoneLabel = (value: string) => timezoneSuggestions.find((option) => option.value === value)?.label || value;

export function ExifEditorWorkspace({ tool }: { tool: ToolInfo }) {
    const [photoPreview, setPhotoPreview] = useState('');
    const [photoDataUrl, setPhotoDataUrl] = useState('');
    const [photoMetadata, setPhotoMetadata] = useState<{ key: string; value: string }[]>([]);
    const [photoName, setPhotoName] = useState('');
    const [photoDate, setPhotoDate] = useState('');
    const [photoZone, setPhotoZone] = useState('UTC');
    const [showTimezoneSuggestions, setShowTimezoneSuggestions] = useState(false);
    const [photoLatitude, setPhotoLatitude] = useState('');
    const [photoLongitude, setPhotoLongitude] = useState('');
    const [photoAltitude, setPhotoAltitude] = useState('');
    const [photoMake, setPhotoMake] = useState('');
    const [photoModel, setPhotoModel] = useState('');
    const [photoOrientation, setPhotoOrientation] = useState('1');
    const [photoMetadataJson, setPhotoMetadataJson] = useState('');
    const [photoMetadataJsonError, setPhotoMetadataJsonError] = useState('');
    const [photoError, setPhotoError] = useState('');
    const [photoMessage, setPhotoMessage] = useState('');
    const [leafletLoaded, setLeafletLoaded] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<Leaflet.Map | null>(null);
    const mapMarkerRef = useRef<Leaflet.Marker | null>(null);
    const leafletRef = useRef<typeof Leaflet>();

    const formatExifValue = (value: unknown): string => {
        if (value instanceof Date) {
            return DateTime.fromJSDate(value).toISO({ suppressMilliseconds: true }) ?? value.toString();
        }

        if (Array.isArray(value)) {
            return value.map((entry) => formatExifValue(entry)).join(', ');
        }

        if (typeof value === 'object' && value !== null) {
            try {
                return JSON.stringify(value);
            } catch (error) {
                console.error('Could not format EXIF value', error);
            }
        }

        if (value === undefined) return '—';
        if (value === null) return 'null';

        return String(value);
    };

    const setMetadataJsonFromObject = (metadata: Record<string, unknown> | undefined) => {
        if (!metadata) {
            setPhotoMetadataJson('');
            return;
        }

        try {
            setPhotoMetadataJson(JSON.stringify(metadata, null, 2));
            setPhotoMetadataJsonError('');
        } catch (error) {
            console.error('Unable to serialize EXIF metadata', error);
            setPhotoMetadataJson('');
            setPhotoMetadataJsonError('Could not serialize EXIF metadata to JSON.');
        }
    };

    const sanitizeExifSection = (section: Record<string, unknown> | undefined, ifd: string) => {
        if (!section) return {};

        const tags = (piexif as { TAGS?: Record<string, Record<number, { type?: unknown }>> }).TAGS?.[ifd] ?? {};

        return Object.entries(section).reduce<Record<number, unknown>>((acc, [key, value]) => {
            const numericKey = Number(key);

            if (Number.isNaN(numericKey)) {
                return acc;
            }

            if (!tags[numericKey] || typeof tags[numericKey].type === 'undefined') {
                return acc;
            }

            acc[numericKey] = value;
            return acc;
        }, {});
    };

    const sanitizeExifForDump = (data: Record<string, any>) => {
        const allowedIfds: string[] = ['0th', 'Exif', 'GPS', 'Interop', '1st'];

        return allowedIfds.reduce<any>((acc, ifd) => {
            acc[ifd] = sanitizeExifSection(data?.[ifd] as Record<string, unknown>, ifd);
            return acc;
        }, { thumbnail: (data as { thumbnail?: string | null }).thumbnail ?? null } as any);
    };

    const buildExifStructure = (data: Record<string, any>) => {
        return {
            '0th': sanitizeExifSection(
                (data as { '0th'?: Record<string, unknown>; Image?: Record<string, unknown> })['0th'] ?? data.Image,
                '0th'
            ),
            Exif: sanitizeExifSection(data.Exif as Record<string, unknown>, 'Exif'),
            GPS: sanitizeExifSection(data.GPS as Record<string, unknown>, 'GPS'),
            Interop: sanitizeExifSection(data.Interop as Record<string, unknown>, 'Interop'),
            '1st': sanitizeExifSection((data as { '1st'?: Record<string, unknown> })['1st'], '1st'),
            thumbnail: (data as { thumbnail?: string | null }).thumbnail ?? null,
        };
    };

    const populatePhotoForm = (metadata: Record<string, unknown>) => {
        const captureDate = metadata.DateTimeOriginal as Date | undefined;
        const offset = (metadata as { OffsetTimeOriginal?: string }).OffsetTimeOriginal;
        const latitude = (metadata as { latitude?: number }).latitude ?? (metadata as { GPSLatitude?: number }).GPSLatitude;
        const longitude =
            (metadata as { longitude?: number }).longitude ?? (metadata as { GPSLongitude?: number }).GPSLongitude;
        const altitude = (metadata as { GPSAltitude?: number }).GPSAltitude;

        if (captureDate instanceof Date && !Number.isNaN(captureDate.getTime())) {
            setPhotoDate(
                DateTime.fromJSDate(captureDate).toISO({ suppressMilliseconds: true, suppressSeconds: true })?.slice(0, 16) ?? ''
            );
        } else {
            setPhotoDate('');
        }

        setPhotoZone(offset || 'UTC');
        setPhotoLatitude(typeof latitude === 'number' ? latitude.toFixed(6) : '');
        setPhotoLongitude(typeof longitude === 'number' ? longitude.toFixed(6) : '');
        setPhotoAltitude(typeof altitude === 'number' ? altitude.toString() : '');
        setPhotoMake((metadata as { Make?: string }).Make || '');
        setPhotoModel((metadata as { Model?: string }).Model || '');
        setPhotoOrientation(String((metadata as { Orientation?: number }).Orientation || '1'));

        const entries = Object.entries(metadata)
            .filter(([, value]) => typeof value !== 'function')
            .map(([key, value]) => ({ key, value: formatExifValue(value) }))
            .sort((a, b) => a.key.localeCompare(b.key));

        setPhotoMetadata(entries);
    };

    const handlePhotoFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setPhotoError('');
        setPhotoMessage('');
        setPhotoName(file.name);

        const reader = new FileReader();
        reader.onload = async () => {
            const dataUrl = reader.result as string;
            setPhotoPreview(dataUrl);
            setPhotoDataUrl(dataUrl);

            try {
                const metadata = (await exifr.parse(file, { gps: true })) as Record<string, unknown> | undefined;
                if (metadata) {
                    populatePhotoForm(metadata);
                    setMetadataJsonFromObject(metadata);

                    const mime = file.type.toLowerCase();
                    const isJpeg = /image\/jpe?g/.test(mime);

                    if (!isJpeg) {
                        setPhotoMessage('Metadata can be inspected for any image, but EXIF updates are saved as JPEG.');
                    } else {
                        try {
                            const rawExif = piexif.load(dataUrl) as Record<string, unknown>;
                            setMetadataJsonFromObject(rawExif);
                        } catch (error) {
                            console.error('Unable to load EXIF JSON from JPEG', error);
                        }
                    }
                } else {
                    setPhotoMetadata([]);
                }
            } catch (error) {
                console.error('Failed to parse EXIF metadata', error);
                setPhotoError('Unable to read EXIF metadata from this file.');
            }
        };

        reader.readAsDataURL(file);
    };

    const decimalToDms = (value: number) => {
        const absolute = Math.abs(value);
        const degrees = Math.floor(absolute);
        const minutesFloat = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesFloat);
        const seconds = Math.round((minutesFloat - minutes) * 60 * 100);

        return [
            [degrees, 1],
            [minutes, 1],
            [seconds, 100],
        ];
    };

    const refreshMetadataFromDataUrl = async (dataUrl: string) => {
        try {
            const buffer = await fetch(dataUrl).then((response) => response.arrayBuffer());
            const metadata = (await exifr.parse(buffer, { gps: true })) as Record<string, unknown> | undefined;
            if (metadata) {
                populatePhotoForm(metadata);
                try {
                    const rawExif = piexif.load(dataUrl) as Record<string, unknown>;
                    setMetadataJsonFromObject(rawExif);
                } catch (error) {
                    console.error('Unable to reload EXIF JSON after update', error);
                }
            }
        } catch (error) {
            console.error('Failed to refresh EXIF metadata', error);
        }
    };

    const handlePhotoSave = async () => {
        setPhotoError('');
        setPhotoMessage('');

        if (!photoDataUrl) {
            setPhotoError('Upload a photo to start editing metadata.');
            return;
        }

        const isJpegDataUrl = /^data:image\/jpe?g/i.test(photoDataUrl);

        if (!isJpegDataUrl) {
            setPhotoError('Updating EXIF requires a JPEG file (.jpg or .jpeg).');
            return;
        }

        try {
            let exifDataRaw: Record<string, any>;

            try {
                exifDataRaw = photoMetadataJson ? JSON.parse(photoMetadataJson) : piexif.load(photoDataUrl);
                setPhotoMetadataJsonError('');
            } catch (error) {
                console.error('Metadata JSON is invalid', error);
                setPhotoMetadataJsonError('Metadata JSON is invalid. Please fix formatting or clear the field.');
                setPhotoError('Metadata JSON is invalid. Fix it before saving.');
                return;
            }

            const exifData = buildExifStructure(exifDataRaw);

            if (photoDate) {
                const captureDate = DateTime.fromISO(photoDate, { zone: photoZone || 'UTC' });
                if (!captureDate.isValid) {
                    setPhotoError('Enter a valid capture date/time and timezone.');
                    return;
                }

                const formatted = captureDate.toFormat('yyyy:MM:dd HH:mm:ss');
                const offset = captureDate.toFormat('ZZ');

                exifData.Exif[piexif.ExifIFD.DateTimeOriginal] = formatted;
                exifData.Exif[piexif.ExifIFD.CreateDate] = formatted;
                exifData.Exif[piexif.ExifIFD.OffsetTimeOriginal] = offset;
            }

            if (photoLatitude && photoLongitude) {
                const lat = Number(photoLatitude);
                const lon = Number(photoLongitude);

                if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                    setPhotoError('Latitude and longitude must be numeric values.');
                    return;
                }

                exifData.GPS[piexif.GPSIFD.GPSLatitude] = decimalToDms(lat);
                exifData.GPS[piexif.GPSIFD.GPSLatitudeRef] = lat >= 0 ? 'N' : 'S';
                exifData.GPS[piexif.GPSIFD.GPSLongitude] = decimalToDms(lon);
                exifData.GPS[piexif.GPSIFD.GPSLongitudeRef] = lon >= 0 ? 'E' : 'W';
            }

            if (photoAltitude) {
                const altitude = Number(photoAltitude);
                if (!Number.isFinite(altitude)) {
                    setPhotoError('Altitude must be a numeric value.');
                    return;
                }

                exifData.GPS[piexif.GPSIFD.GPSAltitude] = [Math.round(Math.abs(altitude) * 100), 100];
                exifData.GPS[piexif.GPSIFD.GPSAltitudeRef] = altitude < 0 ? 1 : 0;
            }

            if (photoMake) {
                exifData['0th'][piexif.ImageIFD.Make] = photoMake;
            }

            if (photoModel) {
                exifData['0th'][piexif.ImageIFD.Model] = photoModel;
            }

            exifData['0th'][piexif.ImageIFD.Orientation] = Number.parseInt(photoOrientation, 10) || 1;

            const exifBytes = piexif.dump(sanitizeExifForDump(exifData));
            const updatedDataUrl = piexif.insert(exifBytes, photoDataUrl);

            setPhotoDataUrl(updatedDataUrl);
            setPhotoPreview(updatedDataUrl);
            await refreshMetadataFromDataUrl(updatedDataUrl);

            const link = document.createElement('a');
            link.href = updatedDataUrl;
            link.download = photoName ? `edited-${photoName}` : 'photo-with-updated-exif.jpg';
            link.click();

            setPhotoMessage('EXIF updated. A new JPEG has been downloaded with your changes.');
        } catch (error) {
            console.error('Failed to update EXIF metadata', error);
            setPhotoError('Unable to update EXIF. Make sure the image is a JPEG and try again.');
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initMap = async () => {
            if (!mapContainerRef.current || mapInstanceRef.current || leafletRef.current || !isMounted) return;

            try {
                const L = await import('leaflet');
                leafletRef.current = L;

                const defaultIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                });

                L.Marker.prototype.options.icon = defaultIcon;

                const map = L.map(mapContainerRef.current).setView([0, 0], 2);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                    maxZoom: 19,
                }).addTo(map);

                map.on('click', (event) => {
                    const lat = event.latlng.lat;
                    const lng = event.latlng.lng;
                    setPhotoLatitude(lat.toFixed(6));
                    setPhotoLongitude(lng.toFixed(6));

                    if (!leafletRef.current) return;

                    if (!mapMarkerRef.current) {
                        mapMarkerRef.current = L.marker([lat, lng]).addTo(map);
                    } else {
                        mapMarkerRef.current.setLatLng([lat, lng]);
                    }
                });

                mapInstanceRef.current = map;
                setLeafletLoaded(true);
            } catch (error) {
                console.error('Failed to initialize map', error);
            }
        };

        initMap();

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!leafletLoaded || !leafletRef.current || !mapInstanceRef.current) return;

        const lat = Number(photoLatitude);
        const lng = Number(photoLongitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const L = leafletRef.current;
        const position = L.latLng(lat, lng);

        if (!mapMarkerRef.current) {
            mapMarkerRef.current = L.marker(position).addTo(mapInstanceRef.current);
        } else {
            mapMarkerRef.current.setLatLng(position);
        }

        mapInstanceRef.current.setView(position, Math.max(mapInstanceRef.current.getZoom(), 5));
    }, [leafletLoaded, photoLatitude, photoLongitude]);

    return (
        <ToolCard title="Photo EXIF & Metadata Editor" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-4 items-start">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-300">Upload a photo</label>
                        <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="w-full" />
                        <p className="text-xs text-slate-400">
                            View metadata from any image. Updating EXIF works best with JPEG files (.jpg / .jpeg).
                        </p>
                        {photoName && (
                            <p className="text-xs text-slate-300">
                                Selected: <span className="font-mono text-white">{photoName}</span>
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="badge">Preview</span>
                            <span className="text-xs text-slate-400">Local only—never uploaded</span>
                        </div>
                        <div className="relative aspect-video rounded-xl bg-slate-900/60 border border-white/10 overflow-hidden">
                            {photoPreview ? (
                                <NextImage
                                    src={photoPreview}
                                    alt="Uploaded photo preview"
                                    fill
                                    className="object-contain"
                                    sizes="(min-width: 1280px) 640px, 100vw"
                                />
                            ) : (
                                <div className="absolute inset-0 grid place-items-center text-sm text-slate-500">
                                    Upload a photo to preview and inspect EXIF metadata.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="badge">Metadata</span>
                            <span className="text-xs text-slate-400">Showing {photoMetadata.length} entries</span>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 max-h-80 overflow-y-auto custom-scrollbar space-y-2">
                            {photoMetadata.length === 0 && (
                                <p className="text-sm text-slate-400">Upload an image to extract EXIF and metadata fields.</p>
                            )}
                            {photoMetadata.map((entry) => (
                                <div key={entry.key} className="grid grid-cols-[1fr_1.1fr] gap-3 text-xs text-slate-200">
                                    <span className="font-semibold text-slate-300 break-words">{entry.key}</span>
                                    <span className="font-mono text-slate-100 break-words">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-white">Capture time & timezone</p>
                            <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Capture date</label>
                                    <input
                                        type="datetime-local"
                                        value={photoDate}
                                        onChange={(e) => setPhotoDate(e.target.value)}
                                        className="w-full px-3 py-2"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Timezone or offset</label>
                                    <div
                                        className="relative"
                                        onBlur={() => setTimeout(() => setShowTimezoneSuggestions(false), 120)}
                                    >
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2 text-left text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                            role="combobox"
                                            aria-expanded={showTimezoneSuggestions}
                                            aria-controls="timezone-suggestion-list"
                                            onClick={() => {
                                                setShowTimezoneSuggestions((prev) => !prev);
                                            }}
                                        >
                                            <span className={photoZone ? 'text-slate-100' : 'text-slate-500'}>
                                                {photoZone ? getZoneLabel(photoZone) : 'Select timezone'}
                                            </span>
                                            <ChevronDownIcon
                                                className={`h-4 w-4 transition-transform ${showTimezoneSuggestions ? 'rotate-180' : ''}`}
                                                aria-hidden
                                            />
                                        </button>
                                        {showTimezoneSuggestions && (
                                            <div
                                                id="timezone-suggestion-list"
                                                className="absolute z-[1200] mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur shadow-xl"
                                            >
                                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                    {timezoneSuggestions.map((zone) => (
                                                        <button
                                                            key={zone.value}
                                                            type="button"
                                                            className="block w-full px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={() => {
                                                                setPhotoZone(zone.value);
                                                                setShowTimezoneSuggestions(false);
                                                            }}
                                                        >
                                                            {zone.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-white">Location (GPS)</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Latitude</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={photoLatitude}
                                        onChange={(e) => setPhotoLatitude(e.target.value)}
                                        placeholder="e.g. 37.7749"
                                        className="w-full px-3 py-2"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Longitude</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={photoLongitude}
                                        onChange={(e) => setPhotoLongitude(e.target.value)}
                                        placeholder="e.g. -122.4194"
                                        className="w-full px-3 py-2"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Altitude (m)</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={photoAltitude}
                                        onChange={(e) => setPhotoAltitude(e.target.value)}
                                        placeholder="Optional"
                                        className="w-full px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <p>Pin location on map</p>
                                    <p>Click anywhere to set latitude/longitude</p>
                                </div>
                                <div
                                    ref={mapContainerRef}
                                    className="h-64 rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Camera make</label>
                                <input
                                    type="text"
                                    value={photoMake}
                                    onChange={(e) => setPhotoMake(e.target.value)}
                                    placeholder="Canon, Apple, Sony"
                                    className="w-full px-3 py-2"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Camera model</label>
                                <input
                                    type="text"
                                    value={photoModel}
                                    onChange={(e) => setPhotoModel(e.target.value)}
                                    placeholder="EOS R5, iPhone 14"
                                    className="w-full px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Orientation</label>
                            <select
                                value={photoOrientation}
                                onChange={(e) => setPhotoOrientation(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50"
                            >
                                <option value="1">1 (Top-Left) - Default</option>
                                <option value="2">2 (Top-Right) - Mirrored horizontal</option>
                                <option value="3">3 (Bottom-Right) - Rotated 180</option>
                                <option value="4">4 (Bottom-Left) - Mirrored vertical</option>
                                <option value="5">5 (Left-Top) - Mirrored horizontal & rotated 270</option>
                                <option value="6">6 (Right-Top) - Rotated 90 CW</option>
                                <option value="7">7 (Right-Bottom) - Mirrored horizontal & rotated 90</option>
                                <option value="8">8 (Left-Bottom) - Rotated 270 CW</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <label>Raw Metadata JSON (Advanced)</label>
                                {photoMetadataJsonError && <span className="text-rose-400">{photoMetadataJsonError}</span>}
                            </div>
                            <textarea
                                value={photoMetadataJson}
                                onChange={(e) => setPhotoMetadataJson(e.target.value)}
                                rows={5}
                                className="w-full font-mono text-xs"
                                placeholder="View or edit raw EXIF structure here..."
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handlePhotoSave}
                                className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-brand hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                Save & Download New Image
                            </button>
                            {photoError && <p className="mt-2 text-center text-sm text-rose-400">{photoError}</p>}
                            {photoMessage && <p className="mt-2 text-center text-sm text-emerald-400">{photoMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
