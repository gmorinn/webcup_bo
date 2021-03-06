import { Grid, Box } from '@mui/material';
import { FC } from 'react';
import FormLogin from './FormLogin';

const Login: FC = () => {
  return (
    <>
      <Grid container className="text-center justify-content-center">
          <Grid item sm={10} md={8} lg={6} sx={{ width: '100%' }}>
              <Box>
                  <h3 className="mb-3">Connexion</h3>
              </Box>
          </Grid>
      </Grid>
      <FormLogin />
    </>
    )
}

export default Login;