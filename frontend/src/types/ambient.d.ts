declare var process: {
  env: Record<string, string | undefined>;
};

declare module 'next' {
  export interface NextConfig {
    typescript?: {
      ignoreBuildErrors?: boolean;
    };
    rewrites?: () => Promise<
      Array<{
        source: string;
        destination: string;
      }>
    >;
    [key: string]: any;
  }
}
