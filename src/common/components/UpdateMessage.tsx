import {
  Button,
  Collapse,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import UpdateIcon from "@material-ui/icons/Update";
import React, { ReactElement, useEffect, useState } from "react";
import { timer } from "rxjs";
import { mergeMap, retry } from "rxjs/operators";
import api from "../../api";
import { isDarwin, isWindows } from "../utils/appUtil";
import WarningMessage from "./WarningMessage";
import { getErrorMsg } from "../utils/errorUtil";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: "100%",
    },
    link: {
      textDecoration: "none",
      color: theme.palette.warning.contrastText,
    },
  })
);

const getFileExtension = (): string => {
  if (isWindows()) {
    return ".exe";
  } else if (isDarwin()) {
    return ".dmg";
  }
  return ".AppImage";
};

const UpdateMessage = (): ReactElement => {
  const classes = useStyles();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [releaseUrl, setReleaseUrl] = useState("");
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  const message =
    "Update available. Download new version, shut down the app, and restart by opening the downloaded file.";

  useEffect(() => {
    if (closed) {
      return;
    }
    const queryInterval = 15 * 60 * 1000; // 15 minutes

    const sub = timer(0, queryInterval)
      .pipe(
        mergeMap(() => api.latestRelease$()),
        retry(3)
      )
      .subscribe({
        next: (resp) => {
          const latestVersion = resp.tag_name.substring(1);
          const currentVersion = (window as any).electron.appVersion();
          const url = resp.assets.find((asset: any) =>
            asset.name.endsWith(getFileExtension())
          )?.browser_download_url;
          setDownloadUrl(url || "");
          setReleaseUrl(resp.html_url);
          setVisible(
            !!latestVersion && !!url && latestVersion !== currentVersion
          );
        },
        error: (err) =>
          (window as any).electron.logError(
            `Failed to retrieve update info: ${getErrorMsg(err)}`
          ),
      });
    return () => sub.unsubscribe();
  }, [closed]);

  return (
    <Collapse in={visible} className={classes.wrapper}>
      <WarningMessage
        message={message}
        customIcon={<UpdateIcon />}
        alignToStart
        showCloseIcon={true}
        onClose={() => {
          setClosed(true);
          setVisible(false);
        }}
        additionalButtons={[
          {
            button: (
              <Button
                size="small"
                color="inherit"
                disableElevation
                onClick={() =>
                  (window as any).electron.openExternal(releaseUrl)
                }
              >
                What's New
              </Button>
            ),
            key: "releaseLink",
          },
          {
            button: (
              <a href={downloadUrl} className={classes.link}>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  disableElevation
                >
                  Download
                </Button>
              </a>
            ),
            key: "closeUpdateBtn",
          },
        ]}
      />
    </Collapse>
  );
};

export default UpdateMessage;
