import { createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { timer } from "rxjs";
import { take } from "rxjs/operators";
import LogoImg from "../../assets/logo-dark.png";
import {
  dockerSettings$,
  isDockerDownloaded$,
  isDockerInstalled$,
  isDockerRunning$,
  isWSL2$,
  rebootRequired$,
  isDockerComposeInstalled$,
  isPermissionDenied$,
} from "../../common/utils/dockerUtil";
import { getNextRoute } from "./next-route";
import { isLinux } from "../../common/utils/appUtil";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      flex: 1,
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoWrapper: {
      width: 400,
      animation: "$zoom 3s infinite ease-out",
    },
    logo: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    "@keyframes zoom": {
      "0%": {
        opacity: 0.5,
        transform: "scale(1)",
      },
      "50%": {
        opacity: 1,
        transform: "scale(1.1)",
      },
      "100%": {
        opacity: 0.5,
        transform: "scale(1)",
      },
    },
  })
);

const Create = (): ReactElement => {
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    // Here we can adjust the minimum amount of time the screen should be visible.
    // This is to prevent sudden "flash" loading screens.
    const MINIMUM_NEXT_ROUTE_DETECTION_TIME = 1000;
    const minimumRuntime = () => timer(MINIMUM_NEXT_ROUTE_DETECTION_TIME);
    getNextRoute(
      minimumRuntime,
      isDockerInstalled$,
      isDockerRunning$,
      isDockerDownloaded$,
      rebootRequired$,
      isWSL2$,
      dockerSettings$,
      isDockerComposeInstalled$,
      isLinux,
      isPermissionDenied$
    )
      .pipe(take(1))
      .subscribe((nextRoute) => history.push(nextRoute));
  });
  return (
    <div className={classes.container}>
      <div className={classes.logoWrapper}>
        <img className={classes.logo} src={LogoImg} alt="OpenDEX logo" />
      </div>
    </div>
  );
};

export default Create;
