/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    clinic: {
      id: string;
    };
    hasUrlPatternMatched: boolean | undefined;
    runtime: {
      start: number;
      end: number;
    };
  }
}
