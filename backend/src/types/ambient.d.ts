declare var process: {
  env: Record<string, string | undefined>;
};

interface RequestInit {
  next?: any;
}

declare module 'express' {
  export interface Request {
    method: string;
    protocol: string;
    originalUrl: string;
    headers: Record<string, string | string[] | undefined>;
    params: Record<string, string | undefined>;
    body: any;
    get(header: string): string | undefined;
  }
  export interface Response {
    status(code: number): this;
    json(data: any): this;
    send(body: any): this;
    end(): this;
  }
  export interface RouterInstance {
    all(path: string, ...handlers: any[]): void;
    get(path: string, ...handlers: any[]): void;
    post(path: string, ...handlers: any[]): void;
    put(path: string, ...handlers: any[]): void;
    delete(path: string, ...handlers: any[]): void;
    use(...args: any[]): void;
  }
  export function Router(): RouterInstance;
  export interface ExpressApp extends RouterInstance {
    listen(port: number | string, cb?: () => void): any;
  }
  function express(): ExpressApp;
  namespace express {
    export function json(options?: any): any;
    export function urlencoded(options?: any): any;
  }
  export default express;
}

declare module 'cors' {
  function cors(options?: any): any;
  export default cors;
}

declare module 'dotenv' {
  export function config(options?: any): any;
  const dotenv: { config: typeof config };
  export default dotenv;
}
