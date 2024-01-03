import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

const Modal = ({ open, onClose, children, title }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        style={{
          width: "400px",
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
