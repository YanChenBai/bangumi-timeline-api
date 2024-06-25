declare module "bun" {
  interface Env {
    BROWSER_PATH?: string;
    PORT?: string;
    DOMAIN?: string;
  }
}

export {};
