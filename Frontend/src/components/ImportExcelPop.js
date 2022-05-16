import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";

export default function ImportExcelPop(props) {
  const {children, openImportExcelPop, setOpenImportExcelPop } = props;
  return (
    <Dialog open={openImportExcelPop}  fullWidth maxWidth="md">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
