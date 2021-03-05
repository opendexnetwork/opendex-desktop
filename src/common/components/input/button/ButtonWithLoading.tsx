import {
  CircularProgress,
  createStyles,
  FormControl,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import Button, { ButtonProps } from "./Button";

type ButtonWithLoadingProps = {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  submitButton?: boolean;
  fullWidth?: boolean;
  color?: "primary" | "secondary";
  error?: boolean;
  helperText?: string;
} & ButtonProps;

const useStyles = makeStyles(() =>
  createStyles({
    buttonWrapper: {
      position: "relative",
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

const ButtonWithLoading = (props: ButtonWithLoadingProps): ReactElement => {
  const classes = useStyles();
  const {
    text,
    disabled,
    loading,
    submitButton,
    fullWidth,
    color,
    error,
    helperText,
    ...buttonProps
  } = props;

  return (
    <FormControl fullWidth={fullWidth}>
      <div className={classes.buttonWrapper}>
        <Button
          text={text}
          type={submitButton ? "submit" : "button"}
          color={color || "primary"}
          disabled={disabled}
          fullWidth={fullWidth}
          {...buttonProps}
        />
        {loading && (
          <CircularProgress
            size={24}
            className={classes.buttonProgress}
            color={color || "primary"}
          />
        )}
      </div>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default ButtonWithLoading;
