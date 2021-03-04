import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { interval } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";
import { isDockerComposeInstalled$ } from "../../../common/utils/dockerUtil";
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
              text="Cancel"
              variant="outlined"
              onClick={() => history.push(Path.HOME)}
            />
            <a
              href="https://docs.docker.com/compose/install/"
              className={classes.installLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                text="Install Docker Compose"
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

export default InstallDockerCompose;
