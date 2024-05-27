import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import LatestMovies from "../latest/latest";
import Watchlist from "../home/home";
import Watched from "../watched/watched";
import Details from "../add/details";
import DetailMovie from "../add/detailMovie";
import Login from "../login/Login";
import Signup from "../login/signup";
import AdminLayout from "../layouts/AdminLayout";
import Users from "../admin/users";
import Forgetpass from "../login/forgetpass";
import ResetPass from "../login/resetPass";
import GuestLayout from "../layouts/GuestLayout";
import Ajouter from "../admin/Ajouter";
import Modifier from "../admin/Modifier";
import Statistique from "../admin/statistique";

const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      ,
      {
        path: "/forget",
        element: <Forgetpass />,
      },
      {
        path: "/password-reset/:token",
        element: <ResetPass />,
      },
      {
        path: "/",
        element: <LatestMovies />,
      },
    ],
  },
  {
    element: <UserLayout />,
    children: [
      
      {
        path: "/home",
        element: <Watchlist />,
      },
      {
        path: "/watched",
        element: <Watched />,
      },
      {
        path: "/details/:id",
        element: <Details />,
      },
      {
        path: "/detailMovie",
        element: <DetailMovie />,
      },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <Users />,
      },{
        path: "/ajouter",
        element: <Ajouter />
      },{
        path:"/modifier/:id",
        element : <Modifier />
      },{
        path:"/state",
        element:<Statistique />
      }
    ],
  },
]);
export default router;
