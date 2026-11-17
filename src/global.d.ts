export {};

declare global {
  interface Window {
    electron: {
      invoke: (channel: string, data?: any) => Promise<any>;
      on: (channel: string, callback: (data: any) => void) => void;
      off: (channel: string, callback: (data: any) => void) => void;
    };
  }
}
