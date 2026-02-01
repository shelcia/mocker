import React, { type ReactNode } from 'react';
import { Box, Button, Modal, Stack, Typography, useMediaQuery } from '@mui/material';
import { MdClose } from 'react-icons/md';

export interface CustomModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  width?: number;
  children?: ReactNode;
}

const CustomModal = ({ open, setOpen, title = '', width = 400, children }: CustomModalProps) => {
  const mobileMatches = useMediaQuery('(max-width:425px)');

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: mobileMatches ? '80%' : width,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: mobileMatches ? 1 : 4,
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
        >
          <Typography variant="h5" component="h2" color="primary">
            {title}
          </Typography>

          <Button
            color="error"
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{
              p: 0.5,
              minWidth: 0,
              borderRadius: '50ex',
              fontSize: '1rem',
            }}
          >
            <MdClose />
          </Button>
        </Stack>

        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
