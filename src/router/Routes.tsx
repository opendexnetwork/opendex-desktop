import React, { ReactElement } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import { Path } from "../router/Path";
import ConnectToRemote from "../setup/ConnectToRemote";
import Create from "../setup/create/Create";
import DownloadDocker from "../setup/create/docker/DownloadDocker";
import IncorrectWslSettings from "../setup/create/docker/IncorrectWslSettings";
import InstallDocker from "../setup/create/docker/InstallDocker";
import RestartRequired from "../setup/create/docker/RestartRequired";
import StartingOpendex from "../setup/create/StartingOpendex";
import OpendexDockerNotDetected from "../setup/OpendexDockerNotDetected";
import Landing from "../setup/Landing";
import WaitingDockerStart from "../setup/create/docker/WaitingDockerStart";
import DockerPermissionDenied from "../setup/create/docker/DockerPermissionDenied";
import InstallDockerCompose from "../setup/create/docker/InstallDockerCompose";

const Routes = (): ReactElement => {
  return (
    <Router>
      <Switch>
        <Route path={Path.CONNECT_TO_REMOTE}>
          <ConnectToRemote />
        </Route>
        <Route path={Path.DASHBOARD}>
          <Dashboard />
        </Route>
        <Route path={Path.DOWNLOAD_DOCKER}>
          <DownloadDocker />
        </Route>
        <Route path={Path.INSTALL_DOCKER_COMPOSE}>
          <InstallDockerCompose />
        </Route>
        <Route path={Path.INSTALL_DOCKER}>
          <InstallDocker />
        </Route>
        <Route path={Path.DOCKER_PERMISSION_DENIED}>
          <DockerPermissionDenied />
        </Route>
        <Route path={Path.STARTING_OPENDEX}>
          <StartingOpendex />
        </Route>
        <Route path={Path.RESTART_REQUIRED}>
          <RestartRequired />
        </Route>
        <Route path={Path.START_ENVIRONMENT}>
          <Create />
        </Route>
        <Route path={Path.WAITING_DOCKER_START}>
          <WaitingDockerStart />
        </Route>
        <Route path={Path.INCOMPATIBLE_WSL_SETTINGS}>
          <IncorrectWslSettings />
        </Route>
        <Route path={Path.CONNECTION_LOST}>
          <OpendexDockerNotDetected />
        </Route>
        <Route path={Path.HOME}>
          <Landing />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
