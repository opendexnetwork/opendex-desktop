const { ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { exec } = require("child_process");
const { Observable, BehaviorSubject } = require("rxjs");
const os = require("os");
const fs = require("fs");
const path = require("path");

// Settings not exposed to the end-user.
const DOCKER_BINARY_DOWNLOAD_URL =
  "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe";
const DOCKER_INSTALLER_FILE_NAME = "docker-installer.exe";

const WINDOWS_DOCKER_EXECUTABLE_PATH =
  "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe";

const DOCKER_SETTINGS_PATH = path.join(
  os.homedir(),
  "AppData/Roaming/Docker/settings.json"
);
const getLauncherPath = () => {
  let fileName = "";
  console.log("platform is", os.platform(), os.platform() === "darwin");
  switch (os.platform()) {
    case "win32":
      fileName = "opendex-launcher.exe";
      break;
    case "darwin":
      fileName = "opendex-launcher-darwin";
      break;
    default:
      fileName = "opendex-launcher";
  }

  const LAUNCHER_LOCATION = isDev
    ? `./assets/${fileName}`
    : `../../${fileName}`;
  return path.join(__dirname, LAUNCHER_LOCATION);
};

const getCommandWithPath = (cmd) => {
  if (os.platform() === "darwin") {
    // extend the packaged mac app PATH to execute docker commands
    return `PATH=$PATH:/usr/local/bin ${cmd}`;
  } else {
    // linux and windows don't need any path adjustments
    return cmd;
  }
};

const LAUNCHER = getLauncherPath();
const BRANCH = "21.02.23-rc.3";
// TODO: remove testnet
const NETWORK = "testnet";
// windows launcher
const WINDOWS_LAUNCHER_COMMAND = `set BRANCH=${BRANCH}&set NETWORK=${NETWORK}&${LAUNCHER}`;
const WINDOWS_LAUNCHER_START = `${WINDOWS_LAUNCHER_COMMAND} setup`;
const WINDOWS_LAUNCHER_STOP = `${WINDOWS_LAUNCHER_COMMAND} down`;
// linux, darwin launcher
const DEFAULT_LAUNCHER_COMMAND = getCommandWithPath(
  `BRANCH=${BRANCH} NETWORK=${NETWORK} '${LAUNCHER}'`
);
const DEFAULT_LAUNCHER_START = `${DEFAULT_LAUNCHER_COMMAND} setup`;
const DEFAULT_LAUNCHER_STOP = `${DEFAULT_LAUNCHER_COMMAND} down`;

const getSetupOpendexDocker = () => {
  if (os.platform() === "win32") {
    // windows
    return WINDOWS_LAUNCHER_START;
  } else {
    // linux and mac
    return DEFAULT_LAUNCHER_START;
  }
};

const getStopOpendexDocker = () => {
  if (os.platform() === "win32") {
    return WINDOWS_LAUNCHER_STOP;
  } else {
    // linux and mac
    return DEFAULT_LAUNCHER_STOP;
  }
};

// List of commands we're allowing the client to execute.
const AVAILABLE_COMMANDS = {
  docker_version: getCommandWithPath("docker version"),
  docker_compose_version: getCommandWithPath("docker-compose version"),
  docker_ps: getCommandWithPath("docker ps"),
  docker_download: `curl ${DOCKER_BINARY_DOWNLOAD_URL} > ${DOCKER_INSTALLER_FILE_NAME}`,
  docker_download_status: `dir | findstr /R "${DOCKER_INSTALLER_FILE_NAME}"`,
  docker_install: `${DOCKER_INSTALLER_FILE_NAME} install --quiet`,
  restart: "shutdown /r",
  windows_version: "ver",
  docker_settings: "settings",
  modify_docker_settings: "settings modify",
  wsl_version: "wsl --set-default-version 2",
  start_docker: `"${WINDOWS_DOCKER_EXECUTABLE_PATH}"`,
  setup_opendex_docker: getSetupOpendexDocker(),
  stop_opendex_docker: getStopOpendexDocker(),
};

const environmentStartedSub = new BehaviorSubject(false);

const execCommand = (cmd) => {
  const cmd$ = new Observable((subscriber) => {
    const handleResponse = (result, error) => {
      if (!error) {
        subscriber.next(result);
        subscriber.complete();
      } else {
        subscriber.error(error);
      }
    };

    if (cmd === AVAILABLE_COMMANDS.docker_settings) {
      fs.readFile(DOCKER_SETTINGS_PATH, { encoding: "utf-8" }, function (
        err,
        settings
      ) {
        handleResponse(settings, err);
      });
    } else if (cmd === AVAILABLE_COMMANDS.modify_docker_settings) {
      fs.readFile(DOCKER_SETTINGS_PATH, { encoding: "utf-8" }, function (
        err,
        settings
      ) {
        if (err) {
          handleResponse(undefined, err);
        }
        const settingsObject = JSON.parse(settings);
        settingsObject.displayedTutorial = true;
        settingsObject.autoStart = false;
        fs.writeFile(
          DOCKER_SETTINGS_PATH,
          JSON.stringify(settingsObject),
          (err) => handleResponse(undefined, err)
        );
      });
    } else {
      exec(cmd, (error, stdout) => handleResponse(stdout, error));
    }
  });
  return cmd$;
};

const ipcHandler = (mainWindow) => {
  ipcMain.on("execute-command", (_event, [reqId, clientCommand]) => {
    const command = AVAILABLE_COMMANDS[clientCommand];
    if (command) {
      execCommand(command).subscribe({
        next: (stdout) => {
          if (!mainWindow.isDestroyed()) {
            mainWindow.webContents.send("execute-command", {
              reqId,
              output: stdout,
            });
          }
        },
        error: (error) => {
          if (!mainWindow.isDestroyed()) {
            mainWindow.webContents.send("execute-command", {
              reqId,
              error,
            });
          }
        },
      });
    } else {
      // Deny executing unknown commands.
      mainWindow.webContents.send("execute-command", {
        reqId,
        error: `${JSON.stringify(clientCommand)} is not allowed.`,
      });
    }
  });
  ipcMain.on("set-environment-started", (_e, [value]) => {
    environmentStartedSub.next(value);
  });
};

module.exports = {
  ipcHandler,
  execCommand,
  AVAILABLE_COMMANDS,
  environmentStartedSub,
};
