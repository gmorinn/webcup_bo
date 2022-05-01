import { useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useRouter from '../hooks/useRouter'
import { useAuth } from '../hooks/useAuth'
import MenuIcon from '@mui/icons-material/Menu';
import { currentUserAtom } from '../store/user';
import Navbar from './Navbar';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { darkModeAtom } from '../store/mode';
import { displayError } from '../utils/toastMessage';

const Header = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const setCurrentUser = useSetRecoilState(currentUserAtom)
  const mode = useRecoilValue(darkModeAtom)

  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const Logout = () => {
    setCurrentUser(null)
    logout()
    displayError('Disconnected!');
    router.push('/sign')
  }

  return (
      <AppBar position="fixed" className={`${!mode && "bg-white"}`}>
        <Toolbar  sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Typography component="div" sx={{ cursor: 'pointer' }}>
              <IconButton
                edge="start"
                className=""
                color="default"
                aria-label="open navbar"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Navbar open={isDrawerOpen} toggleDrawerHandler={() => setDrawerOpen(false)} />
            </Typography>
              <LocalFireDepartmentIcon sx={{ color: `${!mode && "black"}`, cursor: 'pointer' }} onClick={() => router.push('/')}/>
              <div className={`${!mode ? "text-dark" : "text-white"}`} style={{cursor: 'pointer'}} onClick={Logout}>Logout</div>
        </Toolbar>
      </AppBar>
  );
}

export default Header;