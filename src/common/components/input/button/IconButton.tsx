import {
  Tooltip,
  IconButton as MaterialIconButton,
  IconButtonProps as MaterialIconButtonProps,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import { getFormattedTooltipTitle } from "../../../utils/uiUtil";

type IconButtonProps = MaterialIconButtonProps & {
  icon: ReactElement;
  tooltipTitle: string | string[];
  tooltipPlacement?: "left" | "right" | "bottom" | "top";
};

const IconButton = (props: IconButtonProps): ReactElement => {
  const { icon, tooltipTitle, tooltipPlacement, ...iconProps } = props;
  return (
    <Tooltip
      title={getFormattedTooltipTitle(tooltipTitle)}
      placement={tooltipPlacement}
    >
      <MaterialIconButton {...iconProps}>{icon}</MaterialIconButton>
    </Tooltip>
  );
};

export default IconButton;
