import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";

export default function EditPopup(props) {
  const {children, openEditPopup, setOpenEditPopup } = props;
  return (
    <Dialog open={openEditPopup} fullWidth="md">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
