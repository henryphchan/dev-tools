"use client";

import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon, XMarkIcon } from '../icons';
import ToolCard from '../ToolCard';
import { ToolInfo } from '../../lib/tools';

interface FieldConfig {
    id: string;
    name: string;
    type: string;
    category: string;
}

type OutputFormat = 'json' | 'csv' | 'sql';

const CATEGORIES = {
    Person: [
        { label: 'Full Name', value: 'person.fullName' },
        { label: 'First Name', value: 'person.firstName' },
        { label: 'Last Name', value: 'person.lastName' },
        { label: 'Job Title', value: 'person.jobTitle' },
        { label: 'Gender', value: 'person.gender' },
        { label: 'Bio', value: 'person.bio' },
    ],
    Internet: [
        { label: 'Email', value: 'internet.email' },
        { label: 'Username', value: 'internet.username' },
        { label: 'IPv4', value: 'internet.ipv4' },
        { label: 'IPv6', value: 'internet.ipv6' },
        { label: 'MAC Address', value: 'internet.mac' },
        { label: 'URL', value: 'internet.url' },
        { label: 'User Agent', value: 'internet.userAgent' },
    ],
    Location: [
        { label: 'Street Address', value: 'location.streetAddress' },
        { label: 'City', value: 'location.city' },
        { label: 'State', value: 'location.state' },
        { label: 'Country', value: 'location.country' },
        { label: 'Zip Code', value: 'location.zipCode' },
        { label: 'Latitude', value: 'location.latitude' },
        { label: 'Longitude', value: 'location.longitude' },
    ],
    Finance: [
        { label: 'Account Name', value: 'finance.accountName' },
        { label: 'Account Number', value: 'finance.accountNumber' },
        { label: 'Credit Card Number', value: 'finance.creditCardNumber' },
        { label: 'Currency', value: 'finance.currencyName' },
        { label: 'Bitcoin Address', value: 'finance.bitcoinAddress' },
        { label: 'Amount', value: 'finance.amount' },
    ],
    Company: [
        { label: 'Company Name', value: 'company.name' },
        { label: 'Catch Phrase', value: 'company.catchPhrase' },
        { label: 'Buzz Adjective', value: 'company.buzzAdjective' },
        { label: 'Buzz Noun', value: 'company.buzzNoun' },
    ],
    Date: [
        { label: 'Past Date', value: 'date.past' },
        { label: 'Future Date', value: 'date.future' },
        { label: 'Recent Date', value: 'date.recent' },
        { label: 'Month', value: 'date.month' },
        { label: 'Weekday', value: 'date.weekday' },
    ],
    System: [
        { label: 'UUID', value: 'string.uuid' },
        { label: 'File Name', value: 'system.fileName' },
        { label: 'File Extension', value: 'system.fileExt' },
        { label: 'MIME Type', value: 'system.mimeType' },
        { label: 'Semver', value: 'system.semver' },
    ],
    Commerce: [
        { label: 'Product Name', value: 'commerce.productName' },
        { label: 'Price', value: 'commerce.price' },
        { label: 'Department', value: 'commerce.department' },
        { label: 'Product Adjective', value: 'commerce.productAdjective' },
        { label: 'Material', value: 'commerce.productMaterial' },
    ],
    Content: [
        { label: 'Paragraph', value: 'lorem.paragraph' },
        { label: 'Sentence', value: 'lorem.sentence' },
        { label: 'Word', value: 'lorem.word' },
    ],
    Other: [
        { label: 'Boolean', value: 'datatype.boolean' },
        { label: 'Color (Hex)', value: 'color.rgb' },
        { label: 'Phone Number', value: 'phone.number' },
    ]
};

const FLATTENED_FIELDS = Object.entries(CATEGORIES).flatMap(([category, fields]) =>
    fields.map(f => ({ ...f, category }))
);

export function FakeDataGeneratorWorkspace({ tool }: { tool: ToolInfo }) {
    const [fields, setFields] = useState<FieldConfig[]>([
        { id: '1', name: 'id', type: 'string.uuid', category: 'System' },
        { id: '2', name: 'name', type: 'person.fullName', category: 'Person' },
        { id: '3', name: 'email', type: 'internet.email', category: 'Internet' },
        { id: '4', name: 'created_at', type: 'date.past', category: 'Date' }
    ]);
    const [rowCount, setRowCount] = useState<number>(20);
    const [format, setFormat] = useState<OutputFormat>('json');
    const [output, setOutput] = useState<string>('');
    const [tableName, setTableName] = useState<string>('users');
    const [viewMode, setViewMode] = useState<'code' | 'table'>('code');
    const [generatedData, setGeneratedData] = useState<any[]>([]);

    const generateData = () => {
        try {
            const data = [];
            for (let i = 0; i < rowCount; i++) {
                const row: Record<string, any> = {};
                fields.forEach(field => {
                    const [module, method] = field.type.split('.');
                    // @ts-ignore
                    if (faker[module] && typeof faker[module][method] === 'function') {
                        // @ts-ignore
                        row[field.name] = faker[module][method]();
                    } else if (module === 'string' && method === 'uuid') {
                        if (faker.string && faker.string.uuid) {
                            row[field.name] = faker.string.uuid();
                        } else {
                            row[field.name] = faker.internet.mac();
                        }
                    } else {
                        row[field.name] = 'N/A';
                    }

                    if (row[field.name] instanceof Date) {
                        row[field.name] = row[field.name].toISOString();
                    }
                });
                data.push(row);
            }


            setGeneratedData(data);
            formatOutput(data);
        } catch (error) {
            console.error("Generation error:", error);
        }
    };

    const formatOutput = (data: any[]) => {
        let result = '';

        if (format === 'json') {
            result = JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            const headers = fields.map(f => f.name).join(',');
            const rows = data.map(row =>
                fields.map(f => {
                    const val = row[f.name];
                    if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
                    return val;
                }).join(',')
            ).join('\n');
            result = `${headers}\n${rows}`;
        } else if (format === 'sql') {
            const headers = fields.map(f => f.name).join(', ');
            const values = data.map(row => {
                const vals = fields.map(f => {
                    const val = row[f.name];
                    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
                    if (val instanceof Date) return `'${val.toISOString()}'`;
                    return val;
                }).join(', ');
                return `(${vals})`;
            }).join(',\n');
            result = `INSERT INTO ${tableName} (${headers}) VALUES\n${values};`;
        }

        setOutput(result);
    };

    useEffect(() => {
        generateData();
    }, []); // Run once on mount

    useEffect(() => {
        const timer = setTimeout(() => generateData(), 500);
        return () => clearTimeout(timer);
    }, [fields, rowCount, format, tableName]);

    const addField = () => {
        setFields([...fields, {
            id: crypto.randomUUID(),
            name: `field_${fields.length + 1}`,
            type: 'person.firstName',
            category: 'Person'
        }]);
    };

    const updateField = (id: string, updates: Partial<FieldConfig>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const addFieldsByCategory = (category: string) => {
        // @ts-ignore
        const newFields = CATEGORIES[category].map(f => ({
            id: crypto.randomUUID(),
            name: f.label.toLowerCase().replace(/ /g, '_').replace(/\(|\)/g, ''),
            type: f.value,
            category
        }));
        setFields([...fields, ...newFields]);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    const downloadFile = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mock_data.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <ToolCard title={tool.title} description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="flex flex-col gap-6">

                {/* Controls */}
                <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-white">Rows</label>
                        <input
                            type="number"
                            min={1}
                            max={5000}
                            value={rowCount}
                            onChange={e => setRowCount(Math.min(5000, Math.max(1, parseInt(e.target.value) || 0)))}
                            className="w-24 px-3 py-2 rounded-lg bg-slate-950/60 border border-white/10 text-white focus:border-brand/50 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-white">Format</label>
                        <select
                            value={format}
                            onChange={e => setFormat(e.target.value as OutputFormat)}
                            className="w-32 px-3 py-2 rounded-lg bg-slate-950/60 border border-white/10 text-white focus:border-brand/50 focus:outline-none"
                        >
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            <option value="sql">SQL</option>
                        </select>
                    </div>

                    {format === 'sql' && (
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-white">Table Name</label>
                            <input
                                value={tableName}
                                onChange={e => setTableName(e.target.value)}
                                className="w-32 px-3 py-2 rounded-lg bg-slate-950/60 border border-white/10 text-white focus:border-brand/50 focus:outline-none"
                                placeholder="users"
                            />
                        </div>
                    )}

                    <div className="flex-1"></div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => generateData()}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            title="Regenerate Data"
                        >
                            <CursorArrowRaysIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Regenerate</span>
                        </button>
                        <button
                            onClick={downloadFile}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand/90 transition-colors shadow-brand"
                            title="Download File"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden sm:inline">Download</span>
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            title="Copy to Clipboard"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Fields Configuration */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-white">Fields</h3>
                            <div className="flex gap-2">
                                <select
                                    className="text-xs bg-slate-900 border border-white/10 rounded px-2 py-1 text-slate-300 focus:text-white focus:border-brand focus:outline-none"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addFieldsByCategory(e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                >
                                    <option value="">+ Add Category</option>
                                    {Object.keys(CATEGORIES).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={addField}
                                    className="text-sm text-brand hover:text-brand-light flex items-center gap-1"
                                >
                                    + Add Field
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {fields.map((field) => (
                                <div key={field.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2 group hover:border-white/20 transition-colors">
                                    <div className="flex gap-2">
                                        <input
                                            value={field.name}
                                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                                            className="flex-1 px-2 py-1 text-sm bg-transparent border-b border-white/20 text-white focus:border-brand focus:outline-none placeholder:text-slate-600"
                                            placeholder="Field Name"
                                        />
                                        <button
                                            onClick={() => removeField(field.id)}
                                            className="text-slate-500 hover:text-rose-400 p-1"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <select
                                        className="w-full text-sm bg-slate-950/50 border border-white/10 rounded px-2 py-1.5 text-slate-300 focus:text-white focus:border-brand focus:outline-none"
                                        value={field.type}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const cat = FLATTENED_FIELDS.find(f => f.value === val)?.category || 'Other';
                                            updateField(field.id, { type: val, category: cat });
                                        }}
                                    >
                                        {Object.entries(CATEGORIES).map(([cat, opts]) => (
                                            <optgroup key={cat} label={cat} className="bg-slate-900 text-slate-400">
                                                {opts.map(opt => (
                                                    <option key={opt.value} value={opt.value} className="text-white">
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="w-full lg:w-2/3">
                        <div className="h-full min-h-[500px] flex flex-col rounded-xl border border-white/10 bg-[#1e1e1e] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-400">Preview output</span>
                                    <span className="bg-brand/20 text-brand text-[10px] px-1.5 py-0.5 rounded uppercase">{format}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex bg-slate-900 rounded p-1 border border-white/10">
                                        <button
                                            onClick={() => setViewMode('code')}
                                            className={`px-3 py-1 text-xs rounded ${viewMode === 'code' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Code
                                        </button>
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`px-3 py-1 text-xs rounded ${viewMode === 'table' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Table
                                        </button>
                                    </div>
                                    <span className="text-xs text-slate-500">{rowCount} rows</span>
                                </div>
                            </div>

                            {viewMode === 'code' ? (
                                <pre className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-auto custom-scrollbar">
                                    {output}
                                </pre>
                            ) : (
                                <div className="flex-1 overflow-auto custom-scrollbar">
                                    <table className="w-full text-left text-xs text-slate-300">
                                        <thead className="sticky top-0 bg-[#252526] text-slate-100 z-10">
                                            <tr>
                                                <th className="px-4 py-2 border-b border-white/10 w-12 text-center">#</th>
                                                {fields.map(f => (
                                                    <th key={f.id} className="px-4 py-2 border-b border-white/10 font-medium whitespace-nowrap">
                                                        {f.name}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {generatedData.map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="px-4 py-2 text-slate-500 text-center">{i + 1}</td>
                                                    {fields.map(f => (
                                                        <td key={f.id} className="px-4 py-2 whitespace-nowrap">
                                                            {typeof row[f.name] === 'boolean'
                                                                ? (row[f.name] ? 'true' : 'false')
                                                                : String(row[f.name])}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </ToolCard>
    );
}
