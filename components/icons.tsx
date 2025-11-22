import { SVGProps } from 'react';

export function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5 13.4 7l3.6 1.4L13.4 9.8 12 13.3 10.6 9.8 7 8.4 10.6 7z"
      />
      <path strokeLinecap="round" d="M6 4 5.4 5.6 4 6.1 5.4 6.6 6 8.2 6.6 6.6 8 6.1 6.6 5.6z" />
      <path strokeLinecap="round" d="M17 15.5 16.3 17.5 14.3 18.2 16.3 18.9 17 20.9 17.7 18.9 19.7 18.2 17.7 17.5z" />
    </svg>
  );
}

export function CursorArrowRaysIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 6.5 17 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 11h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.6 14.6 17 17l-2.4 1.2-1.6 3.3-5.2-10.6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6.5 6 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 11H3" />
    </svg>
  );
}

export function ClipboardDocumentCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6.5h8V20H8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 11.5 12.3 14l2.2-2.5" />
    </svg>
  );
}

export function ArrowPathRoundedSquareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14v-3.5h6L14 8" />
    </svg>
  );
}

export function MagnifyingGlassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

export function Bars3Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

export function XMarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
