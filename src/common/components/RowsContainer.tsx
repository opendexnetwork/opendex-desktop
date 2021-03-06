import { createStyles, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";

export const SIDE_PADDING = 5;
export const SIDE_PADDING_UNIT = "vh";

const useStyles = makeStyles(() =>
  createStyles({
    gridContainer: {
      flex: 1,
      padding: `5vh ${SIDE_PADDING}${SIDE_PADDING_UNIT}`,
    },
  })
);

function RowsContainer(props: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const { children } = props;
  const classes = useStyles();

  return (
    <Grid
      className={classes.gridContainer}
      container
      justify="space-between"
      direction="column"
      wrap="nowrap"
    >
      {children}
    </Grid>
  );
}
export default RowsContainer;
