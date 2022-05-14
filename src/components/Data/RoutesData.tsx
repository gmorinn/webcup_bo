import { lazy }  from "react";
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../../screens/notFound'

const Datas = lazy(() => import('./Datas'));

const RoutesData = () => {
    const { user } = useAuth()

    return (
        <Routes>
			{
				user && datasRoutes.roles.includes(user.role) && 
				<>
					<Route path="/" element={<Datas />} />
					<Route path="*" element={<NotFound />} />
				</>
			}
		</Routes>
    )
}

export default RoutesData

export const datasRoutes = {
	roles: ["root", "admin"]
};