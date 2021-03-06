import {
  ButtonBase,
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import PlayArrowTwoToneIcon from "@material-ui/icons/PlayArrowTwoTone";
import PowerTwoToneIcon from "@material-ui/icons/PowerTwoTone";
import { inject, observer } from "mobx-react";
import React, { ElementType, useState } from "react";
import { useHistory } from "react-router-dom";
import { isOpendexDockerEnvCreated } from "../common/utils/dockerUtil";
import { Network } from "../enums";
import { Path } from "../router/Path";
import { DOCKER_STORE } from "../stores/dockerStore";
import { SETTINGS_STORE } from "../stores/settingsStore";
import RowsContainer from "../common/components/RowsContainer";
import OpendexLogo from "../common/components/OpendexLogo";
import Button from "../common/components/input/button/Button";

type Item = {
  icon: ElementType;
  title: string;
  additionalInfo: string;
  path: Path;
};

const createItems = (envExists?: boolean): Item[] => [
  {
    title: envExists ? "Start" : "Create",
    additionalInfo: envExists
      ? "OpenDEX testnet environment detected" // TODO: remove 'testnet'
      : "Create new OpenDEX testnet environment", // TODO: remove 'testnet'
    icon: envExists ? PlayArrowTwoToneIcon : AddCircleTwoToneIcon,
    path: Path.START_ENVIRONMENT,
  },
  {
    title: "Connect",
    additionalInfo: "Connect to remote OpenDEX environment",
    icon: PowerTwoToneIcon,
    path: Path.CONNECT_TO_REMOTE,
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 300,
      width: "100%",
    },
    selected: {
      color: theme.palette.primary.light,
      border: `3px outset ${theme.palette.primary.light}`,
    },
    cardTitle: {
      fontWeight: 200,
      marginBottom: theme.spacing(2),
    },
    cardIcon: {
      fontSize: 80,
      margin: theme.spacing(3),
    },
    buttonContainer: {
      marginTop: theme.spacing(3),
      minHeight: 36,
    },
  })
);

const Landing = inject(
  SETTINGS_STORE,
  DOCKER_STORE
)(
  observer(() => {
    const items: Item[] = createItems(
      isOpendexDockerEnvCreated(Network.TESTNET) // TODO: change to MAINNET
    );
    const classes = useStyles();
    const history = useHistory();
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(
      undefined
    );

    const getItemClass = (item: Item): string => {
      return `${classes.card} ${
        selectedItem?.path === item.path ? classes.selected : ""
      }`;
    };

    return (
      <RowsContainer>
        <Grid item container justify="center">
          <OpendexLogo />
        </Grid>
        <Grid item container justify="center" alignItems="center" spacing={9}>
          {items.map((item) => {
            return (
              <Grid key={item.title} item>
                <ButtonBase
                  onClick={() =>
                    setSelectedItem(items.find((i) => i === item)!)
                  }
                >
                  <Card className={getItemClass(item)}>
                    <CardContent>
                      <item.icon className={classes.cardIcon} />
                      <Typography variant="h5" className={classes.cardTitle}>
                        {item.title}
                      </Typography>
                      <Typography
                        component="p"
                        variant="caption"
                        color="textSecondary"
                      >
                        {item.additionalInfo}
                      </Typography>
                    </CardContent>
                  </Card>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>
        <Grid
          item
          container
          justify="flex-end"
          className={classes.buttonContainer}
        >
          {!!selectedItem && (
            <Button
              text="Next"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                history.push(selectedItem!.path);
              }}
            />
          )}
        </Grid>
      </RowsContainer>
    );
  })
);

export default Landing;
