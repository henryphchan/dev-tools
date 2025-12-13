'use client';

import * as duckdb from '@duckdb/duckdb-wasm';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ArrowPathRoundedSquareIcon } from '../icons';

interface ParquetViewerWorkspaceProps {
    tool: ToolInfo;
}

interface SortConfig {
    column: string;
    direction: 'ASC' | 'DESC';
}


const PAGE_SIZE = 1000;

export function ParquetViewerWorkspace({ tool }: ParquetViewerWorkspaceProps) {
    const [db, setDb] = useState<duckdb.AsyncDuckDB | null>(null);
    const [conn, setConn] = useState<duckdb.AsyncDuckDBConnection | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [tableName, setTableName] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data State
    const [schema, setSchema] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [queryTime, setQueryTime] = useState<number>(0);

    // View State
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [filterQuery, setFilterQuery] = useState('');

    // Initialize DuckDB
    useEffect(() => {
        async function init() {
            try {
                const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
                const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

                const worker_url = URL.createObjectURL(
                    new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' })
                );

                const worker = new Worker(worker_url);
                const logger = new duckdb.ConsoleLogger();
                const db = new duckdb.AsyncDuckDB(logger, worker);
                await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

                const conn = await db.connect();

                setDb(db);
                setConn(conn);
                URL.revokeObjectURL(worker_url);
            } catch (err) {
                console.error('Failed to init DuckDB', err);
                setError('Failed to initialize DuckDB engine. Please ensure your browser supports WebAssembly.');
            }
        }

        if (!db) {
            init();
        }
    }, [db]);

    const runQuery = useCallback(async (
        currentConn: duckdb.AsyncDuckDBConnection,
        table: string,
        currentLimit: number,
        currentSort: SortConfig | null,
        currentFilter: string,
        currentSchema: any[]
    ) => {
        const start = performance.now();
        try {
            let query = `SELECT * FROM ${table} `;

            // Filter
            if (currentFilter.trim() && currentSchema.length > 0) {
                // Simple search across all text columns or castable columns
                const conditions = currentSchema.map(col => {
                    return `CAST("${col.column_name}" AS VARCHAR) ILIKE '%${currentFilter.replace(/'/g, "''")}%'`;
                });
                query += `WHERE ${conditions.join(' OR ')} `;
            }

            // Sort
            if (currentSort) {
                query += `ORDER BY "${currentSort.column}" ${currentSort.direction} `;
            } else {
                // Default stable sort by first column (usually ID) to ensure pagination consistency
                query += `ORDER BY 1 ASC `;
            }

            // Limit
            query += `LIMIT ${currentLimit}`;

            const res = await currentConn.query(query);
            setData(res.toArray().map(row => row.toJSON()));
            setQueryTime(performance.now() - start);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Query failed');
        }
    }, []);

    // Effect to re-run query when view state changes
    useEffect(() => {
        if (conn && tableName && schema.length > 0) {
            runQuery(conn, tableName, limit, sortConfig, filterQuery, schema);
        }
    }, [limit, sortConfig, filterQuery, conn, tableName, schema, runQuery]);


    const handleFile = async (selectedFile: File) => {
        if (!db || !conn) return;

        if (selectedFile.size > 500 * 1024 * 1024) {
            const confirm = window.confirm(
                `This file is large (${(selectedFile.size / 1024 / 1024).toFixed(
                    2
                )}MB). It may crash your browser tab. Do you want to verify it anyway?`
            );
            if (!confirm) return;
        }

        setLoading(true);
        setError(null);
        setFile(selectedFile);
        // Reset View State
        setLimit(PAGE_SIZE);
        setSortConfig(null);
        setFilterQuery('');
        setSchema([]);
        setData([]);

        try {
            // Register file
            await db.registerFileHandle(selectedFile.name, selectedFile, duckdb.DuckDBDataProtocol.BROWSER_FILEREADER, true);

            // Create a table view
            const newTableName = `parquet_${Date.now()}`;
            // Use quotes for filename to handle spaces/special chars
            await conn.query(`CREATE VIEW ${newTableName} AS SELECT * FROM '${selectedFile.name}'`);
            setTableName(newTableName);

            // Get count
            const countResult = await conn.query(`SELECT count(*) as c FROM ${newTableName}`);
            const total = Number(countResult.toArray()[0].c);
            setTotalRows(total);

            // Get schema
            const schemaResult = await conn.query(`DESCRIBE ${newTableName}`);
            const newSchema = schemaResult.toArray().map(row => row.toJSON());
            setSchema(newSchema);

            // Initial Query handled by effect since tableName sets
        } catch (err: any) {
            console.error('Error processing parquet file', err);
            setError(err.message || 'Failed to process Parquet file.');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column: string) => {
        setSortConfig(prev => {
            if (prev?.column === column) {
                return prev.direction === 'ASC' ? { column, direction: 'DESC' } : null;
            }
            return { column, direction: 'ASC' };
        });
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <ToolCard title={tool.title} description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="space-y-4">

                {/* Upload Area */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Upload Parquet File</label>
                            <p className="text-xs text-slate-400">Drag & drop or select a local file. Processed entirely in-browser.</p>
                        </div>
                        <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 cursor-pointer hover:border-brand/50 text-slate-300 hover:text-white transition-colors">
                            <input type="file" accept=".parquet" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                            <ArrowPathRoundedSquareIcon className="w-4 h-4" />
                            Select File
                        </label>
                    </div>

                    <div
                        onDrop={onDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${loading ? 'border-brand/50 bg-brand/5' : 'border-white/10 hover:border-brand/30 hover:bg-white/5'
                            }`}
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <ArrowPathRoundedSquareIcon className="w-6 h-6 animate-spin text-brand" />
                                <p className="text-slate-400 animate-pulse">Processing Parquet file...</p>
                            </div>
                        ) : file ? (
                            <div>
                                <p className="text-slate-300 font-medium">{file.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <p className="text-slate-500">Drop file here</p>
                        )}
                    </div>

                    {error && <p className="text-sm text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">{error}</p>}
                </div>

                {/* Data View */}
                {file && !loading && !error && (
                    <div className="space-y-3">
                        {/* Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Rows</p>
                                    <p className="text-lg font-semibold text-white">{totalRows.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Query Time</p>
                                    <p className="text-lg font-semibold text-white">{queryTime.toFixed(0)}ms</p>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono max-w-xs truncate hidden xl:block" title={`Sorting by: ${sortConfig?.column || 'Default (First Column)'}\nRows: ${data.length}/${totalRows}`}>
                                    {sortConfig ? `ORDER BY ${sortConfig.column} ${sortConfig.direction}` : 'ORDER BY 1 ASC'}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-1 max-w-sm">
                                <input
                                    type="text"
                                    placeholder="Filter all columns..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand/50 placeholder:text-slate-600"
                                    value={filterQuery}
                                    onChange={(e) => setFilterQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                            <div className="overflow-auto max-h-[600px]">
                                <table className="min-w-full text-sm text-slate-300">
                                    <thead className="bg-black/20 sticky top-0 backdrop-blur-sm z-10">
                                        <tr>
                                            {schema.map((col: any) => (
                                                <th
                                                    key={col.column_name}
                                                    className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-slate-400 cursor-pointer hover:bg-white/5 select-none transition-colors group"
                                                    onClick={() => handleSort(col.column_name)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {col.column_name}
                                                        <span className="text-[10px] text-slate-600 font-normal border border-white/10 px-1 rounded bg-black/20">{col.column_type}</span>
                                                        {sortConfig?.column === col.column_name && (
                                                            <span className="text-brand">
                                                                {sortConfig!.direction === 'ASC' ? '▲' : '▼'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {data.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                {schema.map((col: any) => (
                                                    <td key={col.column_name} className="px-4 py-2 whitespace-nowrap max-w-xs truncate" title={String(row[col.column_name])}>
                                                        {renderCell(row[col.column_name])}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer / Load More */}
                            <div className="p-3 bg-black/20 border-t border-white/10 flex justify-between items-center text-xs text-slate-500">
                                <span>Showing {data.length.toLocaleString()} of {totalRows.toLocaleString()} rows</span>
                                {data.length < totalRows && (
                                    <button
                                        onClick={() => setLimit(prev => prev + PAGE_SIZE)}
                                        className="text-brand hover:text-brand-light font-medium px-3 py-1 hover:bg-brand/10 rounded transition-colors"
                                    >
                                        Load {PAGE_SIZE} more...
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolCard>
    );
}

function renderCell(value: any): React.ReactNode {
    if (value === null || value === undefined) {
        return <span className="text-slate-600 italic">null</span>;
    }
    if (value instanceof Date) {
        return value.toLocaleString();
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v);
        } catch {
            return '[Object]';
        }
    }
    if (typeof value === 'boolean') {
        return value ? <span className={value ? 'text-emerald-400' : 'text-rose-400'}>{String(value).toUpperCase()}</span> : String(value);
    }
    return String(value);
}
