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

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.48 0-.237-.009-.866-.014-1.699-2.782.602-3.369-1.34-3.369-1.34-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.635-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.097-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.307.679.915.679 1.846 0 1.335-.012 2.415-.012 2.741 0 .265.18.574.688.478A10.005 10.005 0 0122 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}
