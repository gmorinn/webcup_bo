import { Grid } from '@mui/material';
import { FC } from 'react';

const Footer: FC = () => (
  <footer>
    <Grid container className="justify-content-between text-center fs--1 mt-4 mb-3">
        <Grid item sm={6}>
            <p className="mb-0 text-600">
                GM API <span className="d-none d-sm-inline-block">| </span>
                <br className="d-sm-none" /> {new Date().getFullYear()} &copy; <a target="_blank" rel="noreferrer" href="https://guillaume-morin.fr">GM</a>
            </p>
        </Grid>
        <Grid item sm={6}>
            <p className="mb-0 text-600">v1</p>
        </Grid>
    </Grid>
  </footer>
);

export default Footer;
