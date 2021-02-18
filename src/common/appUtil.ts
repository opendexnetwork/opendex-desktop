export const isWindows = (): boolean => {
  return (window as any).electron.platform() === "win32";
};

export const isLinux = (): boolean => {
  return (window as any).electron.platform() === "linux";
};

export const isDarwin = (): boolean => {
  return (window as any).electron.platform() === "darwin";
};

export const logError = (...message: any[]): void => {
  (window as any).electron.logError(message.join("\n"));
};

export const logInfo = (...message: any[]): void => {
  (window as any).electron.logInfo(message.join("\n"));
};
