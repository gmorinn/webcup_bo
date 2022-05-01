import { Container, FormControlLabel, Switch } from "@mui/material";
import { FC, lazy, useEffect, useMemo } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilState, useRecoilValue } from "recoil";
import { useAuth } from "./hooks/useAuth";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CssBaseline from '@mui/material/CssBaseline';
import RoutesUsers from "./components/Users/RoutesUsers";
import RoutesContact from "./components/Contacts/RoutesContacts";
import { darkModeAtom } from "./store/mode";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Sign = lazy(() => import("./screens/sign"))
const NotFound = lazy(() => import("./screens/notFound"))
const Users = lazy(() => import("./components/Users/Users"))

toast.configure();

const App: FC = () => {
  const darkMode = useRecoilValue(darkModeAtom)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode],
  );

  useEffect(() => {
    localStorage.setItem("isDark", String(darkMode))
  }, [darkMode])


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container className="mt-5" maxWidth="xl">
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="sign" element={<PublicRouteOnly component={Sign} />} />

          {/* PRIVATE ROUTE */}
          <Route path="/" element={<PrivateRoute component={Users}/>} />
          <Route path="users/*" element={<PrivateRoute component={RoutesUsers}/>} />
          <Route path="contacts/*" element={<PrivateRoute component={RoutesContact}/>} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

const PrivateRoute = ({ component: Component }:any) => {
	const auth = useAuth()
	const user = auth.loggedIn() && auth.user
  const location = useLocation()
  const [mode, setMode] = useRecoilState(darkModeAtom)

  if (user) {
    return (
      <>
        <Header />
          <FormControlLabel onChange={() => setMode(v => !v)} control={<Switch value={mode} checked={mode}/>} label="Dark" className="p-3" />
          <Component />
        <Footer />
      </>
    )
  }
  return <Navigate to="/sign" state={{ from: `?next=${location.pathname}` }} />
};

const PublicRouteOnly = ({ component: Component }:any) => {
	const auth = useAuth()
	const user = auth.loggedIn() && auth.user

  return !user ? <Component /> : <Navigate to="/" />
};

export default App;