export interface SMTPConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  secure?: boolean;
  from?: string;
  to?: string;
}

export interface SMTPCheckResult {
  success: boolean;
  message: string;
  details?: {
    connectionTime?: number;
    secure?: boolean;
    authMethods?: string[];
    error?: string;
  };
}