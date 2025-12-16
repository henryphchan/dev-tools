import { ReactNode } from 'react';
import { Logo } from './icons';

interface ToolCardProps {
  title: string;
  description: string;
  accent?: string;
  children: ReactNode;
  badge?: string;
}

export default function ToolCard({ title, description, accent = 'brand', children, badge, headingLevel = 'h2' }: ToolCardProps & { headingLevel?: 'h1' | 'h2' | 'h3' }) {
  const Heading = headingLevel;

  return (
    <section className="section-card gradient-border">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">{accent}</p>
          <Heading className="text-xl font-semibold text-slate-50 flex items-center gap-2">
            <Logo className="w-5 h-5 text-brand" />
            {title}
          </Heading>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">{description}</p>
        </div>
        {badge && <span className="badge bg-brand/15 text-brand border-brand/30">{badge}</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
