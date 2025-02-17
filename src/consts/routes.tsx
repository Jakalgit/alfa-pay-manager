import React from "react";
import Login from "../pages/Login.tsx";
import Home from "../pages/Home.tsx";

export interface RouteConfig {
	path: string;
	component: React.ReactNode;
	isPrivate?: boolean; // Опционально: для приватных маршрутов
}

export enum PathEnum {
	DEFAULT = "/",
	LOGIN = "/login"
}

export const routes: RouteConfig[] = [
	{ path: PathEnum.DEFAULT, isPrivate: true, component: <Home /> },
	{ path: PathEnum.LOGIN, component: <Login /> },
]