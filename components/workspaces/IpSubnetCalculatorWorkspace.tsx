'use client';

import { useState, useEffect } from 'react';
import { Address4, Address6 } from 'ip-address';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon } from '../icons';

export function IpSubnetCalculatorWorkspace({ tool }: { tool: ToolInfo }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState<{
        ipAddress: string;
        networkAddress: string;
        broadcastAddress: string;
        subnetMask: string;
        subnetMaskLength: number;
        firstUsable: string;
        lastUsable: string;
        totalHosts: string;
        type: 'IPv4' | 'IPv6';
    } | null>(null);

    useEffect(() => {
        calculateSubnet(input);
    }, [input]);

    const calculateSubnet = (value: string) => {
        if (!value.trim()) {
            setResult(null);
            setError('');
            return;
        }

        try {
            // Try IPv4 first
            if (value.includes('.') && !value.includes(':')) {
                // Default to /32 if no CIDR provided
                const cidrInput = value.includes('/') ? value : `${value}/32`;

                if (!Address4.isValid(cidrInput)) {
                    throw new Error('Invalid IPv4 address');
                }
                const addr = new Address4(cidrInput);

                const subnetMaskLength = addr.subnetMask;
                const subnetMaskStr = prefixToMask(subnetMaskLength);
                const resultStart = addr.startAddress();
                const resultEnd = addr.endAddress();

                const totalHosts = Math.pow(2, 32 - subnetMaskLength);
                const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

                setResult({
                    ipAddress: addr.address,
                    networkAddress: resultStart.address,
                    broadcastAddress: resultEnd.address,
                    subnetMask: subnetMaskStr,
                    subnetMaskLength: subnetMaskLength,
                    firstUsable: usableHosts > 0 ? incrementIp(resultStart.address) : 'N/A',
                    lastUsable: usableHosts > 0 ? decrementIp(resultEnd.address) : 'N/A',
                    totalHosts: usableHosts.toLocaleString(),
                    type: 'IPv4',
                });
                setError('');
            }
            // Try IPv6
            else if (value.includes(':')) {
                const cidrInput = value.includes('/') ? value : `${value}/128`;

                if (!Address6.isValid(cidrInput)) {
                    throw new Error('Invalid IPv6 address');
                }
                const addr = new Address6(cidrInput);

                const start = addr.startAddress();
                const end = addr.endAddress();
                const subnetMaskLength = addr.subnetMask;

                setResult({
                    ipAddress: addr.address,
                    networkAddress: start.address,
                    broadcastAddress: 'N/A (IPv6 uses Multicast)',
                    subnetMask: 'N/A',
                    subnetMaskLength: subnetMaskLength,
                    firstUsable: start.address,
                    lastUsable: end.address,
                    totalHosts: 'Huge (2^' + (128 - subnetMaskLength) + ')',
                    type: 'IPv6',
                });
                setError('');
            } else {
                throw new Error('Invalid format');
            }
        } catch (err) {
            setResult(null);
            setError('Invalid IP Address or CIDR format.');
        }
    };

    const prefixToMask = (prefix: number): string => {
        let mask = 0xffffffff;
        mask = mask << (32 - prefix);
        const part1 = (mask >>> 24) & 0xff;
        const part2 = (mask >>> 16) & 0xff;
        const part3 = (mask >>> 8) & 0xff;
        const part4 = mask & 0xff;
        return `${part1}.${part2}.${part3}.${part4}`;
    };

    // Helper to increment IPv4 string
    const incrementIp = (ip: string): string => {
        const parts = ip.split('.').map(Number);
        for (let i = 3; i >= 0; i--) {
            if (parts[i] < 255) {
                parts[i]++;
                break;
            } else {
                parts[i] = 0;
            }
        }
        return parts.join('.');
    };

    // Helper to decrement IPv4 string
    const decrementIp = (ip: string): string => {
        const parts = ip.split('.').map(Number);
        for (let i = 3; i >= 0; i--) {
            if (parts[i] > 0) {
                parts[i]--;
                break;
            } else {
                parts[i] = 255;
            }
        }
        return parts.join('.');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <ToolCard
            headingLevel="h1"
            title="IP Subnet Calculator"
            description={tool.description}
            badge={tool.badge}
            accent={tool.accent}
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-slate-300">IP Address / CIDR Block</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. 192.168.1.0/24 or 2001:db8::/32"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent font-mono"
                        />
                    </div>
                    {error && <p className="text-sm text-rose-400">{error}</p>}
                </div>

                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ResultItem label="IP Address" value={result.ipAddress} onCopy={() => copyToClipboard(result.ipAddress)} />
                        <ResultItem label="Network Type" value={result.type} />

                        <div className="col-span-1 md:col-span-2 h-px bg-white/5 my-2" />

                        <ResultItem label="CIDR Notation" value={`/${result.subnetMaskLength}`} />
                        <ResultItem label="Netmask" value={result.subnetMask} onCopy={() => copyToClipboard(result.subnetMask)} />

                        <ResultItem label="Network Address" value={result.networkAddress} onCopy={() => copyToClipboard(result.networkAddress)} />
                        <ResultItem label="Broadcast Address" value={result.broadcastAddress} onCopy={() => copyToClipboard(result.broadcastAddress)} />

                        <div className="col-span-1 md:col-span-2 h-px bg-white/5 my-2" />

                        <ResultItem label="First Usable Host" value={result.firstUsable} onCopy={() => copyToClipboard(result.firstUsable)} />
                        <ResultItem label="Last Usable Host" value={result.lastUsable} onCopy={() => copyToClipboard(result.lastUsable)} />

                        <ResultItem label="Usable Hosts" value={result.totalHosts} big />
                    </div>
                )}

                {!result && !error && (
                    <div className="text-center py-12 text-slate-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        <p>Enter an IP address above to verify subnet details.</p>
                    </div>
                )}
            </div>
        </ToolCard>
    );
}

function ResultItem({ label, value, onCopy, big = false }: { label: string; value: string; onCopy?: () => void; big?: boolean }) {
    if (value === 'N/A') return null;

    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 group relative">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`font-mono text-slate-100 ${big ? 'text-xl font-semibold' : 'text-sm'} break-all pr-6`}>
                {value}
            </p>
            {onCopy && (
                <button
                    onClick={onCopy}
                    className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy"
                >
                    <ClipboardDocumentCheckIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
