declare global {
  interface Window {
    SQL: any;
    initSqlJs: () => Promise<any>;
  }
}

export {};
