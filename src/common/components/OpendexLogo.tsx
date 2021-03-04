import { createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";
import LogoImg from "../../assets/logo-dark.png";

const useStyles = makeStyles(() =>
  createStyles({
    logoWrapper: {
      width: 500,
    },
    logo: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
  })
);

const OpendexLogo = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.logoWrapper}>
      <img className={classes.logo} src={LogoImg} alt="OpenDEX logo" />
    </div>
  );
};

export default OpendexLogo;
