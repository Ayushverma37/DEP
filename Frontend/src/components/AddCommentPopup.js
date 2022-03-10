import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";

export default function AddCommentPopup(props) {
  const {children, openAddCommentPopup, setOpenAddCommentPopup } = props;
  return (
    <Dialog open={openAddCommentPopup} fullWidth="md">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
