import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { interval } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";
import { isLinux } from "../../common/appUtil";
import { isDockerComposeInstalled$ } from "../../common/dockerUtil";
import { Path } from "../../router/Path";
import LinkToDiscord from "../LinkToDiscord";
import RowsContainer from "../RowsContainer";

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

const InstallDockerCompose = (): ReactElement => {
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const subscription = interval(5000)
      .pipe(
        mergeMap(() => isDockerComposeInstalled$()),
        filter((isInstalled) => isInstalled)
      )
      .subscribe(() => {
        history.push(Path.START_ENVIRONMENT);
      });
    return () => subscription.unsubscribe();
  }, [history]);

  return (
    <RowsContainer>
      <Grid item container justify="center">
        <Typography variant="h6" component="h2" align="center">
          Docker Compose not detected. In order to create a new OpenDEX
          environment, you need to get Docker Compose.
        </Typography>
      </Grid>
      <Grid
        item
        container
        justify="flex-end"
        direction="column"
        className={classes.buttonsContainer}
      >
        <Grid item container justify="space-between">
          <>
            <Button
              variant="outlined"
              disableElevation
              onClick={() => history.push(Path.HOME)}
            >
              Cancel
            </Button>
            {isLinux() && (
              <a
                href="https://docs.docker.com/compose/install/"
                className={classes.installLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  endIcon={<ArrowForwardIcon />}
                >
                  Install Docker Compose
                </Button>
              </a>
            )}
          </>
        </Grid>
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default InstallDockerCompose;
