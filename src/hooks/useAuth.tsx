import jwtDecode, { JwtPayload } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ResultJwt } from "../utils/types";


const authContext = createContext<any | null>(null);
const api = process.env.REACT_APP_API_URL

type ProvideAuthProps = {
    children: React.ReactNode
}

export const ProvideAuth = ({ children }:ProvideAuthProps) => {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth} >{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

const setAccessToken = (token:string) => token && localStorage.setItem('accessToken', token)

const setRefreshToken = (token:string) => token && localStorage.setItem('refreshToken', token)

const setOAuthToken = (oAuth:string) => sessionStorage.setItem('oAuth', oAuth)

const getAccessToken = () => localStorage.getItem('accessToken')

const getRefreshToken = () => localStorage.getItem('refreshToken')

const getOAuthToken = () => sessionStorage.getItem('oAuth')

const getUser = (jwt?:string):any | null => {
	let token = jwt || getAccessToken()
	let user = token ? jwtDecode<JwtPayload>(token) : null
	return user;
};

const isTokenExpired = (token:string):Boolean => {
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		if (decoded?.exp && decoded.exp < Date.now() / 1000) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		localStorage.removeItem("refreshToken")
		sessionStorage.removeItem("accessToken")
		return false;
	}
};


const loggedIn = ():Boolean => {
	const token = getAccessToken();
	if (!!token && !isTokenExpired(token)) {
		return true
	}
	return false
};


function useProvideAuth() {
	const [user, setUser] = useState<any | null>(null);
	const [load, setLoad] = useState<Boolean>(false);

	const [oAuth, setOAuth] = useState<String | null>(null)

	const getAuthorization = async ():Promise<any> => {
		setLoad(true);

		const response = await fetch(`${api}/authorization`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: 'POST',
			body: JSON.stringify({
				grant_type: "client_credentials",
				client_id: process.env.REACT_APP_CLIENT_ID,
				client_secret: process.env.REACT_APP_CLIENT_SECRET
			})
		});

		const body = await response.json();
		setOAuth(body.access_token);
		setOAuthToken(body.access_token);
		setLoad(false);
		return body.access_token;
	}

	useEffect(() => {
		!oAuth && getAuthorization()
		return () => {
			getOAuthToken()
		}
	}, [oAuth])

	const refreshToken = async (refresh_token?:string):Promise<ResultJwt | any> => {
		const r_token = refresh_token || getRefreshToken()

		if (!r_token) {
			return logout()
		}

		setLoad(true)
		return await fetch(`${api}/refresh`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				refresh_token: getRefreshToken()
			})
		}).then(async resp => {
			if (resp.status === 403) {
				return await getAuthorization().then(async () => await refreshToken(refresh_token))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
	};

	const loginBo = async (email:string, password:string):Promise<any> => {
		setLoad(true)
		return await fetch(`${api}/bo/signin`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				email: email,
				password: password
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await loginBo(email, password))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
		.catch(err => {
			console.error(err)
			return err
		})
	};

	const logout = () => {
		localStorage.removeItem("refreshToken")
		localStorage.removeItem("accessToken")
		setUser(() => null)
	};

	useEffect(() => {
		if (loggedIn()) {
			setUser(getUser())
		} else {
			refreshToken()
		}
		// eslint-disable-next-line
	}, []);

	// Return the user object and auth methods
	return {
		getAuthorization,
		getOAuthToken,
		getAccessToken,
		loggedIn,
		refreshToken,
		load,
		user,
		loginBo,
		logout,
	};
}