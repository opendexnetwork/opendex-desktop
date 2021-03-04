import {
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { timer } from "rxjs";
import { delay, mergeMap, retryWhen } from "rxjs/operators";
import api from "../api";
import { Path } from "../router/Path";
import { DOCKER_STORE } from "../stores/dockerStore";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import RowsContainer from "../common/components/RowsContainer";

type OpendexDockerNotDetectedProps = WithStores;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spinnerContainer: {
      padding: theme.spacing(8),
    },
    titleContainer: {
      padding: theme.spacing(2),
    },
  })
);

const OpendexDockerNotDetected = inject(
  SETTINGS_STORE,
  DOCKER_STORE
)(
  observer(({ settingsStore, dockerStore }: OpendexDockerNotDetectedProps) => {
    const history = useHistory();
    const classes = useStyles();
    const [connectionFailed, setConnectionFailed] = useState(false);

    useEffect(() => {
      const subscription = timer(0, 5000)
        .pipe(
          mergeMap(() =>
            api.statusByService$("opendexd", settingsStore!.opendexDockerUrl)
          ),
          retryWhen((errors) => errors.pipe(delay(5000)))
        )
        .subscribe({
          next: () => history.push(Path.DASHBOARD),
          error: () => setConnectionFailed(true),
        });
      return () => subscription.unsubscribe();
    }, [history, connectionFailed, settingsStore, dockerStore]);

    return (
      <RowsContainer>
        <Grid container item direction="column">
          <Grid
            container
            item
            alignItems="center"
            justify="center"
            wrap="nowrap"
            spacing={2}
            className={classes.titleContainer}
          >
            <Grid item>
              <ReportProblemOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item>
              <Typography variant="h4" component="h1" align="center">
                Connection to OpenDEX Docker lost
              </Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" justify="center">
            <Typography variant="body1" align="center">
              Trying to reconnect. Please check your environment.
            </Typography>
          </Grid>
          {!connectionFailed && (
            <Grid
              container
              item
              justify="center"
              className={classes.spinnerContainer}
            >
              <CircularProgress color="inherit" />
            </Grid>
          )}
          <Grid container item alignItems="center" justify="center">
            <Button
              component={RouterLink}
              to={Path.HOME}
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
            >
              Go To Start Page
            </Button>
          </Grid>
        </Grid>
      </RowsContainer>
    );
  })
);

export default OpendexDockerNotDetected;
