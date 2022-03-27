import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";

export default function AddFundsPopUp(props) {
    const {children, openAddFundsPopUp, setOpenAddFundsPopUp} = props;
    return (
      <Dialog open={openAddFundsPopUp} fullWidth maxWidth="md">
        
        <DialogContent dividers>{children}</DialogContent>
      </Dialog>
    );
  }
