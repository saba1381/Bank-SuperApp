import React  , {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle , Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteCardButton = ({ cardNumber, onDelete }) => {
    const [open, setOpen] = useState(false);
    const handleClickOpen = ()=>{
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
    }
    const deleteCard = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/card/delete-card/${cardNumber}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,  
                },
            });

            if (response.ok) {
                console.log("کارت با موفقیت حذف شد");
                onDelete();  
                handleClose();
            } else {
                console.error("خطا در حذف کارت");
            }
        } catch (error) {
            console.error("مشکل در ارتباط با سرور", error);
        }
    };

    return (
        <>

        <Button
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();   
                handleClickOpen();;
            }}
            sx={{
                minWidth: 0,
                color: 'inherit',
                fontSize: '24px',
                '&:hover': {
                        color: 'pink',  
                    },
                backgroundColor:'gray'
            }}
        >
            <DeleteIcon sx={{fontSize:{xs:'18px' , sm:'21px'}}} />
            <Typography variant="h6" component="span" sx={{fontSize:{xs:'11px' , sm:'15px'}}}>
                    حذف کارت
                </Typography>
        </Button>
         <Dialog
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
         PaperProps={{
            sx: { borderRadius: '20px' , boxShadow:24 }, 
        }}
     >
         <DialogTitle id="alert-dialog-title" style={{fontSize:'18px'}}>{"حذف کارت بانکی"}</DialogTitle>
         <DialogContent>
             <DialogContentText id="alert-dialog-description" color='primary'>
                 آیا از حذف کارت بانکی خود مطمئن هستید؟
             </DialogContentText>
         </DialogContent>
         <DialogActions sx={{ display: 'flex', justifyContent: 'start'}}>
         <Button
                 onClick={() => {
                     deleteCard(); 
                 }}
                 autoFocus
                 color='primary'
                 
             >
                 بله
             </Button>
             <Button onClick={handleClose} sx={{color:'red'}}>
                 خیر
             </Button>
             
         </DialogActions>
     </Dialog>
     </>
    );
};

export default DeleteCardButton;
