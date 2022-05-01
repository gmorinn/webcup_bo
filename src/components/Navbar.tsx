import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from "react-router-dom";

type PropsIcon = {
  text: string,
  redirect: () => void,
  icon: any
}

type PropsNavBar = {
  toggleDrawerHandler?: () => void,
  open: boolean
}

const Icon = ({ icon, text, redirect }: PropsIcon) => {
  return (
      <ListItemButton onClick={redirect}>
          <ListItemIcon>
              {icon}
          </ListItemIcon>
          <ListItemText primary={text}/>
      </ListItemButton>
  )
}

const Navbar =({ toggleDrawerHandler, open }:PropsNavBar) => {
  const navigate = useNavigate()

  return (
    <Drawer open={open} onClose={toggleDrawerHandler}>
      <div
        onKeyDown={toggleDrawerHandler}
        onClick={toggleDrawerHandler}
      >
      <List>
        <Icon text="Users" icon={<GroupIcon />} redirect={() => navigate("/users")} />
        <Icon text="Contacts" icon={<GroupIcon />} redirect={() => navigate("/contacts")} />
      </List>
    </div>
    </Drawer>
  );
};

export default (Navbar);
