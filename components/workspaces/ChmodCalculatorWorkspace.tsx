'use client';

import { useState, useMemo } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon } from '../icons';

export function ChmodCalculatorWorkspace({ tool }: { tool: ToolInfo }) {
    const [chmodPermissions, setChmodPermissions] = useState({
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        others: { read: true, write: false, execute: true },
    });

    const [chmodSpecial, setChmodSpecial] = useState({
        setuid: false,
        setgid: false,
        sticky: false,
    });

    const togglePermission = (scope: 'owner' | 'group' | 'others', permission: 'read' | 'write' | 'execute') => {
        setChmodPermissions((prev) => ({
            ...prev,
            [scope]: {
                ...prev[scope],
                [permission]: !prev[scope][permission],
            },
        }));
    };

    const chmodSummary = useMemo(() => {
        const digitFor = (scope: keyof typeof chmodPermissions) => {
            const perms = chmodPermissions[scope];
            return (perms.read ? 4 : 0) + (perms.write ? 2 : 0) + (perms.execute ? 1 : 0);
        };

        const ownerDigit = digitFor('owner');
        const groupDigit = digitFor('group');
        const otherDigit = digitFor('others');

        const specialDigit = (chmodSpecial.setuid ? 4 : 0) + (chmodSpecial.setgid ? 2 : 0) + (chmodSpecial.sticky ? 1 : 0);
        const octal = `${specialDigit ? specialDigit : ''}${ownerDigit}${groupDigit}${otherDigit}`;

        const ownerExec = chmodPermissions.owner.execute
            ? chmodSpecial.setuid
                ? 's'
                : 'x'
            : chmodSpecial.setuid
                ? 'S'
                : '-';

        const groupExec = chmodPermissions.group.execute
            ? chmodSpecial.setgid
                ? 's'
                : 'x'
            : chmodSpecial.setgid
                ? 'S'
                : '-';

        const otherExec = chmodPermissions.others.execute
            ? chmodSpecial.sticky
                ? 't'
                : 'x'
            : chmodSpecial.sticky
                ? 'T'
                : '-';

        const symbolic =
            `${chmodPermissions.owner.read ? 'r' : '-'}${chmodPermissions.owner.write ? 'w' : '-'}${ownerExec}` +
            `${chmodPermissions.group.read ? 'r' : '-'}${chmodPermissions.group.write ? 'w' : '-'}${groupExec}` +
            `${chmodPermissions.others.read ? 'r' : '-'}${chmodPermissions.others.write ? 'w' : '-'}${otherExec}`;

        return {
            octal,
            fullOctal: `${specialDigit}${ownerDigit}${groupDigit}${otherDigit}`,
            symbolic,
        };
    }, [chmodPermissions, chmodSpecial]);

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (error) {
            console.error('Clipboard copy failed', error);
        }
    };

    return (
        <ToolCard title="Chmod Calculator" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(
                        [
                            { key: 'owner', label: 'Owner' },
                            { key: 'group', label: 'Group' },
                            { key: 'others', label: 'Others' },
                        ] as const
                    ).map((scope) => (
                        <div key={scope.key} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                            <p className="text-sm font-semibold text-white">{scope.label}</p>
                            <div className="grid grid-cols-3 gap-2">
                                {([
                                    { key: 'read', label: 'Read' },
                                    { key: 'write', label: 'Write' },
                                    { key: 'execute', label: 'Exec' },
                                ] as const).map((perm) => {
                                    const isActive = chmodPermissions[scope.key][perm.key];
                                    return (
                                        <button
                                            key={perm.key}
                                            onClick={() => togglePermission(scope.key, perm.key)}
                                            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${isActive
                                                ? 'border-brand/60 bg-brand/20 text-white shadow-brand'
                                                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30'
                                                }`}
                                        >
                                            {perm.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(
                        [
                            { key: 'setuid', label: 'Setuid (u+s)', help: 'Use caller UID on execution' },
                            { key: 'setgid', label: 'Setgid (g+s)', help: 'Use caller GID on execution' },
                            { key: 'sticky', label: 'Sticky (t)', help: 'Only owners can delete inside dirs' },
                        ] as const
                    ).map((flag) => (
                        <label key={flag.key} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                            <input
                                type="checkbox"
                                checked={chmodSpecial[flag.key]}
                                onChange={(e) => setChmodSpecial((prev) => ({ ...prev, [flag.key]: e.target.checked }))}
                                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5"
                            />
                            <div>
                                <p className="font-semibold text-white">{flag.label}</p>
                                <p className="text-slate-400 text-xs">{flag.help}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="code-output space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Octal (compact)</p>
                            <button onClick={() => copyToClipboard(chmodSummary.octal)} className="flex items-center gap-1 text-xs text-slate-300 hover:text-white">
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
                            </button>
                        </div>
                        <p className="text-lg font-semibold text-white">{chmodSummary.octal}</p>
                    </div>

                    <div className="code-output space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Octal (4-digit)</p>
                            <button onClick={() => copyToClipboard(chmodSummary.fullOctal)} className="flex items-center gap-1 text-xs text-slate-300 hover:text-white">
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
                            </button>
                        </div>
                        <p className="text-lg font-semibold text-white">{chmodSummary.fullOctal}</p>
                        <p className="text-xs text-slate-400">Includes special bits as the leading digit.</p>
                    </div>

                    <div className="code-output space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Symbolic</p>
                            <button onClick={() => copyToClipboard(chmodSummary.symbolic)} className="flex items-center gap-1 text-xs text-slate-300 hover:text-white">
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
                            </button>
                        </div>
                        <p className="text-lg font-semibold text-white">{chmodSummary.symbolic}</p>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
