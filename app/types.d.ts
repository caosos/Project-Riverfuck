declare module '*.css';
declare module 'next/link' {
  const Link: (props: { href: string; className?: string; children?: any; [key: string]: any }) => any;
  export default Link;
}
declare module 'next' { export type NextConfig = Record<string, unknown>; }
declare module 'tailwindcss' { export type Config = Record<string, unknown>; }
declare namespace React { type ReactNode = any; }
declare namespace JSX { interface IntrinsicElements { [elemName: string]: any; } }
