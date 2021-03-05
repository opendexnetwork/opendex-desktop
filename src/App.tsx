import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createMuiTheme,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import { createStyles, ThemeProvider } from "@material-ui/styles";
import { Provider } from "mobx-react";
import React, { ReactElement } from "react";
import { OPENDEX_DOCKER_LOCAL_TESTNET_URL } from "./constants";
import { useDockerStore } from "./stores/dockerStore";
import { useSettingsStore } from "./stores/settingsStore";
import { Grid } from "@material-ui/core";
import UpdateMessage from "./common/components/UpdateMessage";
import Routes from "./router/Routes";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#f45c24",
    },
  },
});

const GlobalCss = withStyles((theme: Theme) => {
  return {
    "@global": {
      "::-webkit-scrollbar": {
        width: 8,
      },
      "::-webkit-scrollbar-track": {
        background: theme.palette.background.default,
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
        background: theme.palette.background.paper,
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: theme.palette.grey[700],
      },
      "::-webkit-scrollbar-corner": {
        backgroundColor: "transparent",
      },
      "#root": {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      },
    },
  };
})(() => null);

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      height: "100%",
    },
  })
);

const settingsStore = useSettingsStore({
  // TODO: change to mainnet
  opendexDockerUrl: OPENDEX_DOCKER_LOCAL_TESTNET_URL,
});

const dockerStore = useDockerStore({
  isInstalled: false,
  isRunning: false,
});

localStorage.removeItem("rebootRequired");

function App(): ReactElement {
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalCss />
      <Grid
        container
        direction="column"
        wrap="nowrap"
        className={classes.wrapper}
      >
        <Grid item container>
          <UpdateMessage />
        </Grid>
        <Provider settingsStore={settingsStore} dockerStore={dockerStore}>
          <Routes />
        </Provider>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
