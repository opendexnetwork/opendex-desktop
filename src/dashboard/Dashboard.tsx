import { Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
import { Path } from "../router/Path";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import { handleEvent } from "./eventHandler";

type DashboardProps = WithStores;

const useStyles = makeStyles(() =>
  createStyles({
    iframeContainer: {
      display: "flex",
      flex: 1,
    },
    iframe: {
      display: "flex",
      flex: 1,
      width: "100%",
      border: "none",
    },
  })
);

const Dashboard = inject(SETTINGS_STORE)(
  observer(
    (props: DashboardProps): ReactElement => {
      const history = useHistory();
      const classes = useStyles();
      const { settingsStore } = props;

      useEffect(() => {
        api
          .statusByService$("proxy", settingsStore!.opendexDockerUrl)
          .subscribe({
            next: () => {},
            error: () => history.push(Path.CONNECTION_LOST),
          });
        const messageListenerHandler = (event: MessageEvent) => {
          if (event.origin === settingsStore!.opendexDockerUrl) {
            handleEvent(event, history, settingsStore!);
          }
        };
        window.addEventListener("message", messageListenerHandler);
        return () =>
          window.removeEventListener("message", messageListenerHandler);
      }, [history, settingsStore]);

      return (
        <Grid item container className={classes.iframeContainer}>
          <iframe
            className={classes.iframe}
            src={settingsStore!.opendexDockerUrl}
            title="OpenDEX UI"
          />
        </Grid>
      );
    }
  )
);

export default Dashboard;
