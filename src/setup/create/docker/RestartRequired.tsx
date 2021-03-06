import { Grid, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CheckIcon from "@material-ui/icons/Check";
import React, { ReactElement, useEffect } from "react";
import { combineLatest, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { logInfo } from "../../../common/utils/appUtil";
import {
  DockerSettings,
  dockerSettings$,
  isWSL2$,
  restart$,
} from "../../../common/utils/dockerUtil";
import LinkToDiscord from "../../LinkToDiscord";
import RowsContainer from "../../../common/components/RowsContainer";
import InfoBar from "../../../common/components/InfoBar";
import Button from "../../../common/components/input/button/Button";

const RestartRequired = (): ReactElement => {
  useEffect(() => {
    combineLatest([dockerSettings$(), isWSL2$()])
      .pipe(
        mergeMap(([dockerSettings, isWSL2]) => {
          const { wslEngineEnabled } = dockerSettings as DockerSettings;
          logInfo("wslEngineEnabled", wslEngineEnabled);
          logInfo("isWSL2", isWSL2);
          if (wslEngineEnabled && !isWSL2) {
            logInfo(
              "TODO: change wslEngineEnabled to false since only WSL 1 is supported"
            );
          }
          return of(true);
        })
      )
      .subscribe((r) => {
        logInfo("settings have been updated", r);
      });
  });
  return (
    <RowsContainer>
      <Grid item container>
        <InfoBar text="Docker Installed!" icon={CheckIcon} />
      </Grid>
      <Grid item container justify="center" direction="column">
        <Typography variant="h6" component="h2" align="center">
          System reboot required to continue.
        </Typography>
        <Typography
          variant="overline"
          component="p"
          color="textSecondary"
          align="center"
        >
          After reboot, please reopen OpenDEX Desktop.
        </Typography>
      </Grid>
      <Grid item container justify="flex-end">
        <Grid item container justify="flex-end">
          <Button
            text="Reboot PC"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              restart$().subscribe(() => {
                window.close();
              });
            }}
          />
        </Grid>
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default RestartRequired;
