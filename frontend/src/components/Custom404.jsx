import React from 'react';
import { Box, Button, Typography, CardContent } from '@mui/material';

const Custom404 = () => {
    return (
        <>
            <React.Fragment>
                <CardContent>
                    <Box
                        sx={ {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            p: 5
                        } }
                    >
                        <Typography variant="h1" >
                            404
                        </Typography>
                        <Typography variant="h6" sx={{mt:1}}>
                            The page you’re looking for doesn’t exist.
                        </Typography>
                        <Button variant="contained" sx={{mt:3}} onClick={() => window.history.back()} >Back</Button>
                    </Box>
                </CardContent>
            </React.Fragment>
        </>
    )
}

export default Custom404