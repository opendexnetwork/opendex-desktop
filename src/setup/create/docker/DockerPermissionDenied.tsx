import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { interval } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";
import { isPermissionDenied$ } from "../../../common/utils/dockerUtil";
import { Path } from "../../../router/Path";
import LinkToDiscord from "../../LinkToDiscord";
import RowsContainer from "../../../common/components/RowsContainer";
import Button from "../../../common/components/input/button/Button";

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
              text="Cancel"
              variant="outlined"
              onClick={() => history.push(Path.HOME)}
            />
            <a
              href="https://docs.docker.com/engine/install/linux-postinstall/"
              className={classes.installLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                text="Post-installation steps for Linux"
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
              />
            </a>
          </>
        </Grid>
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default DockerPermissionDenied;
