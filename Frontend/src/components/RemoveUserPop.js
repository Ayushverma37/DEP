import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";

export default function RemoveUserPop(props) {
  const {children, openRemoveUserPop, setopenRemoveUserPop } = props;
  return (
    <Dialog open={openRemoveUserPop}  fullWidth maxWidth="xs">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
