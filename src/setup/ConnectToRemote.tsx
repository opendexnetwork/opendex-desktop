import { createStyles, Fade, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { History } from "history";
import { inject, observer } from "mobx-react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
import { Path } from "../router/Path";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import { ConnectionType } from "../enums";
import RowsContainer from "../common/components/RowsContainer";
import Button from "../common/components/input/button/Button";
import TextField from "../common/components/input/text/TextField";
import ButtonWithLoading from "../common/components/input/button/ButtonWithLoading";

type ConnectToRemoteProps = WithStores;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowGroup: {
      padding: theme.spacing(5),
    },
    adornmentMargin: {
      marginRight: 0,
    },
  })
);

const ConnectToRemote = inject(SETTINGS_STORE)(
  observer(({ settingsStore }: ConnectToRemoteProps) => {
    const history = useHistory();
    const classes = useStyles();
    const [ipAndPort, setIpAndPort] = useState(settingsStore!.opendexDockerUrl);
    const [connectionFailed, setConnectionFailed] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const ipAndPortWithoutHttp = ipAndPort.startsWith("http://")
      ? ipAndPort.substring(7)
      : ipAndPort.startsWith("https://")
      ? ipAndPort.substring(8)
      : ipAndPort;

    return (
      <RowsContainer>
        <Grid item container direction="column" justify="center">
          <Grid
            container
            item
            alignItems="center"
            justify="center"
            className={classes.rowGroup}
          >
            <Typography variant="h4" component="h4">
              Connect to a remote OpenDEX environment
            </Typography>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            justify="center"
            className={classes.rowGroup}
          >
            <form noValidate autoComplete="off">
              <Grid
                container
                item
                alignItems="center"
                direction="column"
                spacing={4}
              >
                <Grid item container justify="center">
                  <TextField
                    id="ip-port"
                    label="IP:Port"
                    value={ipAndPortWithoutHttp}
                    startAdornment={
                      <InputAdornment
                        className={classes.adornmentMargin}
                        position="start"
                      >
                        https://
                      </InputAdornment>
                    }
                    onChange={(e) => {
                      setConnectionFailed(false);
                      setIpAndPort(`https://${e.target.value}`);
                    }}
                  />
                </Grid>
                <Grid>
                  <Fade
                    in={connectionFailed && !connecting}
                    style={{
                      transitionDelay: "300ms",
                    }}
                  >
                    <Grid item container justify="center">
                      <Typography
                        variant="body2"
                        component="p"
                        color="secondary"
                      >
                        Error: Connection failed
                      </Typography>
                    </Grid>
                  </Fade>
                </Grid>
                <Grid item container justify="center">
                  <ButtonWithLoading
                    text={connectionFailed ? "Retry" : "Connect"}
                    submitButton
                    disabled={connecting}
                    loading={connecting}
                    onClick={(e) => {
                      e.preventDefault();
                      handleConnectClick(
                        setConnectionFailed,
                        setConnecting,
                        history,
                        ipAndPort,
                        settingsStore!.setOpendexDockerUrl,
                        settingsStore!.setConnectionType
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        <Grid item container>
          <Button
            text="Back"
            variant="outlined"
            onClick={() => history.push(Path.HOME)}
            startIcon={<ArrowBackIcon />}
          />
        </Grid>
      </RowsContainer>
    );
  })
);

const handleConnectClick = (
  setConnectionFailed: (value: boolean) => void,
  setConnecting: (value: boolean) => void,
  history: History,
  opendexDockerUrl: string,
  setOpendexDockerUrl: (ip: string) => void,
  setConnectionType: (type: ConnectionType) => void
): void => {
  setConnecting(true);
  api.statusByService$("opendexd", opendexDockerUrl).subscribe({
    next: () => {
      setConnectionFailed(false);
      setConnecting(false);
      setOpendexDockerUrl(opendexDockerUrl);
      setConnectionType(ConnectionType.REMOTE);
      history.push(Path.DASHBOARD);
    },
    error: () => {
      setConnectionFailed(true);
      setConnecting(false);
    },
  });
};

export default ConnectToRemote;
