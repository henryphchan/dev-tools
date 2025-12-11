import Link from 'next/link';
import { ToolInfo } from '../lib/tools';

export function Breadcrumb({ tool }: { tool: ToolInfo }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-slate-300 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
                Home
            </Link>
            <span aria-hidden className="text-slate-500">/</span>
            <span className="text-white font-semibold">{tool.title}</span>
        </nav>
    );
}
