'use client';

import { useState } from 'react';
import yaml from 'js-yaml';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ArrowPathRoundedSquareIcon, ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

export function YamlJsonConverterWorkspace({ tool }: { tool: ToolInfo }) {
    const [yamlInput, setYamlInput] = useState('');
    const [jsonFromYaml, setJsonFromYaml] = useState('');
    const [yamlError, setYamlError] = useState('');
    const [jsonForYaml, setJsonForYaml] = useState('');
    const [yamlFromJson, setYamlFromJson] = useState('');
    const [jsonToYamlError, setJsonToYamlError] = useState('');

    const handleYamlToJson = () => {
        try {
            const parsed = yaml.load(yamlInput);
            setJsonFromYaml(JSON.stringify(parsed, null, 2));
            setYamlError('');
        } catch (error) {
            setYamlError('Invalid YAML. Make sure indentation and syntax are correct.');
            setJsonFromYaml('');
        }
    };

    const handleJsonToYaml = () => {
        try {
            const parsed = JSON.parse(jsonForYaml || '');
            setYamlFromJson(yaml.dump(parsed, { lineWidth: 100 }));
            setJsonToYamlError('');
        } catch (error) {
            setJsonToYamlError('Invalid JSON for conversion. Please check the structure.');
            setYamlFromJson('');
        }
    };

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (error) {
            console.error('Clipboard copy failed', error);
        }
    };

    return (
        <ToolCard headingLevel="h1" title="YAML ↔ JSON Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-sm text-slate-300">YAML input</label>
                    <textarea
                        value={yamlInput}
                        onChange={(e) => setYamlInput(e.target.value)}
                        placeholder={`app:\n  env: prod`}
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleYamlToJson}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                        >
                            <CursorArrowRaysIcon className="h-4 w-4" />
                            Convert to JSON
                        </button>
                        {jsonFromYaml && (
                            <button
                                onClick={() => copyToClipboard(jsonFromYaml)}
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                            >
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy JSON
                            </button>
                        )}
                    </div>
                    {yamlError && <p className="text-sm text-rose-400">{yamlError}</p>}
                    {jsonFromYaml && <pre className="code-output" aria-label="JSON from YAML">{jsonFromYaml}</pre>}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-4">
                    <label className="text-sm text-slate-300">JSON input</label>
                    <textarea
                        value={jsonForYaml}
                        onChange={(e) => setJsonForYaml(e.target.value)}
                        placeholder='{"app":{"env":"prod"}}'
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleJsonToYaml}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10"
                        >
                            <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                            Convert to YAML
                        </button>
                        {yamlFromJson && (
                            <button
                                onClick={() => copyToClipboard(yamlFromJson)}
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                            >
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy YAML
                            </button>
                        )}
                    </div>
                    {jsonToYamlError && <p className="text-sm text-rose-400">{jsonToYamlError}</p>}
                    {yamlFromJson && <pre className="code-output" aria-label="YAML from JSON">{yamlFromJson}</pre>}
                </div>
            </div>
        </ToolCard>
    );
}
