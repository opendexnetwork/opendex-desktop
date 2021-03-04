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
import { isLinux } from "../../../common/utils/appUtil";
import { isPermissionDenied$ } from "../../../common/utils/dockerUtil";
import { Path } from "../../../router/Path";
import LinkToDiscord from "../../LinkToDiscord";
import RowsContainer from "../../../common/components/RowsContainer";

const useStyles = makeStyles(() =>
  createStyles({
    buttonsContainer: {
      minHeight: 90,
    },
    installLink: {
      textDecoration: "none",
    },
    stepsContainer: {
      width: "657px",
    },
  })
);

const DockerPermissionDenied = (): ReactElement => {
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const subscription = interval(5000)
      .pipe(
        mergeMap(() => isPermissionDenied$()),
        filter((isPermissionDenied) => !isPermissionDenied)
      )
      .subscribe(() => {
        history.push(Path.START_ENVIRONMENT);
      });
    return () => subscription.unsubscribe();
  }, [history]);

  return (
    <RowsContainer>
      <Grid item container direction="column">
        <Grid item container justify="center">
          <Typography variant="h6" component="h2" align="center">
            Docker permission denied. Please follow the post-installation steps
            and:
          </Typography>
        </Grid>
        <Grid item container justify="center">
          <ul className={classes.stepsContainer}>
            <li>Log out and log back in</li>
            <li>Restart your machine if still seeing this</li>
          </ul>
        </Grid>
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
                href="https://docs.docker.com/engine/install/linux-postinstall/"
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
                  Post-installation steps for Linux
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

export default DockerPermissionDenied;
