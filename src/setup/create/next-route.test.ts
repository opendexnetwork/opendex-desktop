import { getNextRoute } from "./next-route";
import { TestScheduler } from "rxjs/testing";
import { Path } from "../../router/Path";
import { Observable } from "rxjs";
import { DockerSettings } from "../../common/utils/dockerUtil";

let testScheduler: TestScheduler;

type CreateFlowState = {
  isDownloaded: boolean;
  isInstalled: boolean;
  isDockerComposeInstalled: boolean;
  isRunning: boolean;
  rebootRequired: boolean;
  isWSL2: boolean;
  dockerSettings: DockerSettings;
  isLinux: boolean;
  isPermissionDenied: boolean;
};

const assertNextStep = (expectedPath: Path, dockerInfo: CreateFlowState) => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable } = helpers;
    const expected = "1s (a|)";
    const minimumRuntime = () =>
      (cold("1s a") as unknown) as Observable<number>;
    const isInstalled = () =>
      (cold("1s a", { a: dockerInfo.isInstalled }) as unknown) as Observable<
        boolean
      >;
    const isPermissionDenied = () =>
      (cold("1s a", {
        a: dockerInfo.isPermissionDenied,
      }) as unknown) as Observable<boolean>;
    const isDockerComposeInstalled = () =>
      (cold("1s a", {
        a: dockerInfo.isDockerComposeInstalled,
      }) as unknown) as Observable<boolean>;
    const isRunning = () =>
      (cold("1s a", { a: dockerInfo.isRunning }) as unknown) as Observable<
        boolean
      >;
    const isDownloaded = () =>
      (cold("1s a", { a: dockerInfo.isDownloaded }) as unknown) as Observable<
        boolean
      >;
    const rebootRequired = () =>
      (cold("1s a", { a: dockerInfo.rebootRequired }) as unknown) as Observable<
        boolean
      >;
    const isWSL2 = () =>
      (cold("1s a", { a: dockerInfo.isWSL2 }) as unknown) as Observable<
        boolean
      >;
    const dockerSettings = () =>
      (cold("1s a", { a: dockerInfo.dockerSettings }) as unknown) as Observable<
        DockerSettings
      >;
    const isLinux = () => dockerInfo.isLinux;
    expectObservable(
      getNextRoute(
        minimumRuntime,
        isInstalled,
        isRunning,
        isDownloaded,
        rebootRequired,
        isWSL2,
        dockerSettings,
        isDockerComposeInstalled,
        isLinux,
        isPermissionDenied
      )
    ).toBe(expected, {
      a: expectedPath,
    });
  });
};

describe("nextStep$", () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    (window as any).electron = {
      logInfo: () => {},
    };
  });

  it("directs to download", () => {
    const expectedPath = Path.DOWNLOAD_DOCKER;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: false,
      isLinux: false,
      isDockerComposeInstalled: false,
      isRunning: false,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {},
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to install", () => {
    const expectedPath = Path.INSTALL_DOCKER;
    const dockerInfo = {
      isDownloaded: true,
      isInstalled: false,
      isLinux: false,
      isDockerComposeInstalled: false,
      isRunning: false,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {},
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to permission denied", () => {
    const expectedPath = Path.DOCKER_PERMISSION_DENIED;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: false,
      isLinux: true,
      isDockerComposeInstalled: false,
      isRunning: false,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {},
      isPermissionDenied: true,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to install docker-compose on linux", () => {
    const expectedPath = Path.INSTALL_DOCKER_COMPOSE;
    const dockerInfo = {
      isDownloaded: true,
      isInstalled: true,
      isLinux: true,
      isDockerComposeInstalled: false,
      isRunning: false,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {},
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to reboot", () => {
    const expectedPath = Path.RESTART_REQUIRED;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: false,
      isLinux: false,
      isDockerComposeInstalled: false,
      isRunning: false,
      rebootRequired: true,
      isWSL2: false,
      dockerSettings: {},
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to incorrect WSL settings when docker settings change required", () => {
    const expectedPath = Path.INCOMPATIBLE_WSL_SETTINGS;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: false,
      isLinux: false,
      isDockerComposeInstalled: false,
      isRunning: false,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {
        wslEngineEnabled: true,
      },
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to starting OpenDEX", () => {
    const expectedPath = Path.STARTING_OPENDEX;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: true,
      isLinux: false,
      isDockerComposeInstalled: true,
      isRunning: true,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {},
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to waiting docker start", () => {
    const expectedPath = Path.WAITING_DOCKER_START;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: true,
      isLinux: false,
      isDockerComposeInstalled: true,
      isRunning: false,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {},
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to waiting docker when unknown command, but settings file exists", () => {
    const expectedPath = Path.WAITING_DOCKER_START;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: false,
      isLinux: false,
      isDockerComposeInstalled: false,
      isRunning: false,
      rebootRequired: false,
      isWSL2: false,
      dockerSettings: {
        wslEngineEnabled: false,
      },
      isPermissionDenied: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });
});
