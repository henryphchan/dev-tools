
'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon, XMarkIcon } from '../icons';
import { copyToClipboard } from './utils';

const CHEATSHEET_ITEMS = [
    { label: 'Heading 1', code: '# Header 1' },
    { label: 'Heading 2', code: '## Header 2' },
    { label: 'Bold', code: '**bold text**' },
    { label: 'Italic', code: '_italic text_' },
    { label: 'Blockquote', code: '> quote' },
    { label: 'Unordered List', code: '- Item 1\n- Item 2' },
    { label: 'Ordered List', code: '1. Item 1\n2. Item 2' },
    { label: 'Code', code: '`inline code`' },
    { label: 'Code Block', code: '```\ncode block\n```' },
    { label: 'Link', code: '[link text](url)' },
    { label: 'Image', code: '![alt text](url)' },
    { label: 'Horizontal Rule', code: '---' },
];

export function MarkdownPreviewWorkspace({ tool }: { tool: ToolInfo }) {
    const [markdown, setMarkdown] = useState<string>('# Hello World\n\nStart typing **markdown** on the left to see the _preview_ on the right!');
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const [showCheatsheet, setShowCheatsheet] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    // Helper to get line number from textarea cursor position
    const handleCursorActivity = () => {
        if (!textareaRef.current) return;
        const cursorPosition = textareaRef.current.selectionStart;
        const textBeforeCursor = textareaRef.current.value.substring(0, cursorPosition);
        const lineNumber = textBeforeCursor.split('\n').length; // 1-based line number for consistency with standard Markdown renderers
        setActiveLine(lineNumber);
    };

    // Helper to find matching element in preview and highlight it
    useEffect(() => {
        if (!previewRef.current || activeLine === null) return;

        // Clear previous highlights
        const prevHighlights = previewRef.current.querySelectorAll('.highlight-active');
        prevHighlights.forEach(el => el.classList.remove('highlight-active', 'bg-brand/10', 'ring-1', 'ring-brand/50', 'rounded-lg', 'transition-colors', 'duration-300'));

        // Find new element
        // We look for elements where the line falls within [data-start-line, data-end-line]
        const elements = Array.from(previewRef.current.querySelectorAll('[data-start-line]'));

        // Find the most specific (deepest or smallest range) element that contains the line
        let bestMatch: Element | null = null;
        let smallestRange = Infinity;

        elements.forEach(el => {
            const start = parseInt(el.getAttribute('data-start-line') || '0');
            const end = parseInt(el.getAttribute('data-end-line') || '0');

            if (activeLine >= start && activeLine <= end) {
                const range = end - start;
                if (range < smallestRange) {
                    smallestRange = range;
                    bestMatch = el;
                }
            }
        });

        if (bestMatch) {
            (bestMatch as HTMLElement).classList.add('highlight-active', 'bg-brand/10', 'ring-1', 'ring-brand/50', 'rounded-lg', 'transition-colors', 'duration-300');
            (bestMatch as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

    }, [activeLine, markdown]);

    // Handle click in preview to sync to textarea
    const handlePreviewClick = (e: React.MouseEvent) => {
        const target = (e.target as HTMLElement).closest('[data-start-line]');
        if (target && textareaRef.current) {
            const startLine = parseInt(target.getAttribute('data-start-line') || '1');

            // Find char index for that line
            const lines = markdown.split('\n');
            let charIndex = 0;
            for (let i = 0; i < startLine - 1; i++) {
                // Add +1 for newline char
                charIndex += lines[i].length + 1;
            }

            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(charIndex, charIndex);
            // Update active line to feedback the selection
            setActiveLine(startLine);

            // Scroll textarea to the line
            const lineHeight = 20; // Approximate or calculate if possible. simple approach:
            const scrollPos = (startLine - 1) * lineHeight;
            // Better: textarea already scrolls to cursor on focus usually, but let's try to center it if needed.
            // Native behavior of setSelectionRange usually scrolls if focused?
            // Actually, precise scrolling in textarea needs some hacks (measuring line height). 
            // Let's rely on native behavior + simple scroll adjustments.

            // Check if we can scroll to a percentage?
            // Fallback: just focus.
        }
    };

    // Helper to attach data attributes
    // Note: react-markdown provides `node` in props which contains position
    const ComponentWithLoc = ({ node, className, ...props }: any) => {
        const startLine = node?.position?.start?.line;
        const endLine = node?.position?.end?.line;

        // We filter props to avoid passing invalid attributes to DOM if they are not standard
        // data-start-line is fine.

        const dataProps = startLine ? {
            'data-start-line': startLine,
            'data-end-line': endLine || startLine
        } : {};

        // For specific tags where we want to wrap or passthrough
        const Tag = node.tagName || 'div';

        // Avoid double rendering if Tag is complex?
        // Actually we can just return specific tags in the definitions below
        return <Tag {...props} {...dataProps} className={className} />;
    }

    const commonProps = (node: any) => {
        const start = node?.position?.start?.line;
        const end = node?.position?.end?.line;
        return start ? { 'data-start-line': start, 'data-end-line': end } : {};
    };

    return (
        <ToolCard headingLevel="h1" title={tool.title} description={tool.description} badge={tool.badge} accent={tool.accent}>
            {showCheatsheet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCheatsheet(false)}>
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h3 className="text-xl font-bold text-white">Markdown Cheatsheet</h3>
                            <button
                                onClick={() => setShowCheatsheet(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {CHEATSHEET_ITEMS.map((item) => (
                                <div key={item.label} className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
                                    <code className="block bg-black/30 rounded-lg p-2 text-sm font-mono text-brand-200 break-words whitespace-pre-wrap">
                                        {item.code}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] min-h-0">
                {/* Input Area */}
                <div className="flex flex-col gap-2 min-h-0">
                    <div className="flex justify-between items-center text-sm text-slate-400">
                        <span>Markdown Input</span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCheatsheet(true)}
                                className="hover:text-brand transition-colors font-medium"
                            >
                                Cheatsheet
                            </button>
                            <button
                                onClick={() => setMarkdown('')}
                                className="hover:text-white transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        onSelect={handleCursorActivity}
                        onKeyUp={handleCursorActivity}
                        onClick={handleCursorActivity}
                        className="flex-1 w-full p-4 rounded-xl border border-white/10 bg-white/5 text-slate-200 focus:border-brand/50 focus:outline-none resize-none font-mono text-sm overflow-auto"
                        placeholder="Type your markdown here..."
                    />
                </div>

                {/* Preview Area */}
                <div className="flex flex-col gap-2 min-h-0">
                    <div className="flex justify-between items-center text-sm text-slate-400">
                        <span>Preview</span>
                    </div>
                    <div
                        ref={previewRef}
                        onClick={handlePreviewClick}
                        className="flex-1 w-full p-4 rounded-xl border border-white/10 bg-white/5 overflow-y-auto"
                    >
                        <div className="prose prose-invert max-w-none text-slate-300">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 {...commonProps(node)} className="text-2xl font-bold text-white mb-4" {...props} />,
                                    h2: ({ node, ...props }) => <h2 {...commonProps(node)} className="text-xl font-bold text-white mb-3 mt-6" {...props} />,
                                    h3: ({ node, ...props }) => <h3 {...commonProps(node)} className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                                    p: ({ node, ...props }) => <p {...commonProps(node)} className="mb-4 leading-relaxed" {...props} />,
                                    ul: ({ node, ...props }) => <ul {...commonProps(node)} className="list-disc list-inside mb-4 ml-4" {...props} />,
                                    ol: ({ node, ...props }) => <ol {...commonProps(node)} className="list-decimal list-inside mb-4 ml-4" {...props} />,
                                    li: ({ node, ...props }) => <li {...commonProps(node)} className="mb-1" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote {...commonProps(node)} className="border-l-4 border-brand/50 pl-4 italic my-4 text-slate-400" {...props} />,
                                    code: ({ node, className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const isInline = !match && !String(children).includes('\n')
                                        // For inline code we might not want block highlight, but let's attach data anyway?
                                        // Usually inline code doesn't get its own position in mdast if it's part of paragraph? 
                                        // It does have position. But let's attach to parent?
                                        // We attach matching logic to nearest [data-start-line].
                                        return isInline
                                            ? <code {...commonProps(node)} className="bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-brand-200" {...props}>{children}</code>
                                            : <pre {...commonProps(node)} className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4"><code className="text-sm font-mono text-slate-200" {...props}>{children}</code></pre>
                                    },
                                    a: ({ node, ...props }) => <a {...commonProps(node)} className="text-brand hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                    img: ({ node, ...props }) => <img {...commonProps(node)} className="max-w-full rounded-lg my-4" {...props} alt={props.alt || ''} />,
                                    hr: ({ node, ...props }) => <hr {...commonProps(node)} className="border-white/10 my-6" {...props} />,
                                }}
                            >
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
