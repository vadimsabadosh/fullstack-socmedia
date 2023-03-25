import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { setLogin } from "state";

function App() {
	const mode = useSelector((state) => state.mode);
	const [isLoading, setisLoading] = useState(true);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const dispatch = useDispatch();

	const isAuth = Boolean(useSelector((state) => state.token));
	const token = useSelector((state) => state.token);
	useEffect(() => {
		if (token) {
			setisLoading(true);
			fetch("http://localhost:3001/auth/check-user", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((result) => {
					if (result.ok) {
						dispatch(
							setLogin({
								user: result.data.user,
								token: result.data.token,
							})
						);
					}
				})
				.finally(() => setisLoading(false));
		}
	}, [token]);
	if (isLoading) {
		return <div>Loading....</div>;
	}

	return (
		<div className="app">
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Routes>
						<Route
							path="/"
							element={isAuth ? <Navigate to="/home" /> : <LoginPage />}
						/>
						<Route
							path="/home"
							element={isAuth ? <HomePage /> : <Navigate to="/" />}
						/>
						<Route
							path="/profile/:userId"
							element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
						/>
					</Routes>
				</ThemeProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
