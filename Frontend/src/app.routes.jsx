import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Dashboard from "./features/dashboard/pages/Dashboard";

import MainLayout from "./components/MainLayout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><MainLayout><Home /></MainLayout></Protected>
    },
    {
        path: "/dashboard",
        element: <Protected><MainLayout><Dashboard /></MainLayout></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><MainLayout><Interview /></MainLayout></Protected>
    }
])