import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { interval, Subscription } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";
import { isWindows } from "../../../common/utils/appUtil";
import {
  downloadDocker$,
  isDockerInstalled$,
  isPermissionDenied$,
} from "../../../common/utils/dockerUtil";
import { Path } from "../../../router/Path";
import LinkToDiscord from "../../LinkToDiscord";
import RowsContainer from "../../../common/components/RowsContainer";
import InfoBar from "../../../common/components/InfoBar";
import Button from "../../../common/components/input/button/Button";

const useStyles = makeStyles(() =>
  createStyles({
    buttonsContainer: {
      minHeight: 90,
    },
    installLink: {
      textDecoration: "none",
    },
  })
);

const DownloadDocker = (): ReactElement => {
  const history = useHistory();
  const classes = useStyles();
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const subs = new Subscription();
    subs.add(
      interval(5000)
        .pipe(
          mergeMap(() => isDockerInstalled$()),
          filter((isInstalled) => isInstalled)
        )
        .subscribe(() => {
          history.push(Path.START_ENVIRONMENT);
        })
    );
    subs.add(
      interval(5000)
        .pipe(
          mergeMap(() => isPermissionDenied$()),
          filter((isPermissionDenied) => isPermissionDenied)
        )
        .subscribe(() => {
          history.push(Path.START_ENVIRONMENT);
        })
    );
    return () => {
      subs.unsubscribe();
    };
  }, [history]);

  return (
    <RowsContainer>
      <Grid item container>
        {isDownloading && (
          <InfoBar text="Downloading Docker" showCircularProgress={true} />
        )}
      </Grid>
      <Grid item container justify="center">
        <Typography variant="h6" component="h2" align="center">
          Docker not detected. In order to create a new OpenDEX environment, you
          need to get install and start Docker.
        </Typography>
      </Grid>
      <Grid
        item
        container
        justify="flex-end"
        direction="column"
        className={classes.buttonsContainer}
      >
        {!isDownloading && (
          <Grid item container justify="space-between">
            <>
              <Button
                text="Cancel"
                variant="outlined"
                onClick={() => history.push(Path.HOME)}
              />
              {isWindows() && (
                <Button
                  text="Download Now"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    setIsDownloading(true);
                    downloadDocker$().subscribe(() =>
                      history.push(Path.START_ENVIRONMENT)
                    );
                  }}
                />
              )}
              {!isWindows() && (
                <a
                  href="https://docs.docker.com/engine/install/"
                  rel="noopener noreferrer"
                  className={classes.installLink}
                  target="_blank"
                >
                  <Button
                    text="Install Docker"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                  />
                </a>
              )}
            </>
          </Grid>
        )}
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default DownloadDocker;
