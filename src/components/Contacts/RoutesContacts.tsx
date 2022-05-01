import { lazy }  from "react";
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../../screens/notFound'

const Contacts = lazy(() => import('./Contacts'));

const RoutesContact = () => {
    const { user } = useAuth()

    return (
        <Routes>
			{
				user && contactsRoutes.roles.includes(user.role) && 
				<>
					<Route path="/" element={<Contacts />} />
					<Route path="*" element={<NotFound />} />
				</>
			}
		</Routes>
    )
}

export default RoutesContact

export const contactsRoutes = {
	roles: ["root", "admin"]
};