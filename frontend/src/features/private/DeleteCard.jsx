import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { UseAppDispatch, UseAppSelector } from "../../store/configureStore";
import { deleteCard } from "../account/accountSlice";

const DeleteCardButton = ({ cardNumber, onDelete }) => {
  const dispatch = UseAppDispatch();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteCard(cardNumber))
      .then(() => {
        console.log("کارت با موفقیت حذف شد");
        onDelete();
        handleClose();
      })
      .catch((error) => {
        console.error("خطا در حذف کارت", error);
      });
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleClickOpen();
        }}
        sx={{
          minWidth: 0,

          color: "inherit",
          fontSize: "24px",
          "&:hover": {
            color: "pink",
          },
          minWidth: 0,
        }}
      >
        <DeleteIcon sx={{ fontSize: { xs: "20px", sm: "21px" } }} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: { borderRadius: "20px", boxShadow: 24 },
        }}
      >
        <DialogTitle id="alert-dialog-title" style={{ fontSize: "18px" }}>
          {"حذف کارت بانکی"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color="primary">
            آیا از حذف کارت بانکی خود مطمئن هستید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "start" }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            autoFocus
            color="primary"
          >
            بله
          </Button>
          <Button onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }} sx={{ color: "red" }}>
            خیر
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteCardButton;
