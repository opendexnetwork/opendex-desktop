import { observable, reaction } from "mobx";
import { ConnectionType } from "../enums";

export type Settings = {
  opendexDockerUrl: string;
  connectionType?: ConnectionType;
};

export type SettingsStore = ReturnType<typeof useSettingsStore>;

export const SETTINGS_STORE = "settingsStore";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSettingsStore = (defaultSettings: Settings) => {
  const store = observable({
    settings: defaultSettings,
    get opendexDockerUrl(): string {
      return store.settings.opendexDockerUrl;
    },
    setOpendexDockerUrl(url: string): void {
      store.settings.opendexDockerUrl = url;
    },
    get connectionType(): ConnectionType | undefined {
      return store.settings.connectionType;
    },
    setConnectionType(value: ConnectionType): void {
      store.settings.connectionType = value;
    },
  });

  updateFromLocalStorage(store);
  addToLocalStorage(store);

  return store;
};

function updateFromLocalStorage(store: SettingsStore): void {
  const storedJson = localStorage.getItem(SETTINGS_STORE);
  if (storedJson) {
    Object.assign(store, JSON.parse(storedJson));
  }
}

function addToLocalStorage(store: SettingsStore): void {
  reaction(
    () => JSON.stringify(store),
    (json) => {
      localStorage.setItem(SETTINGS_STORE, json);
    }
  );
}
