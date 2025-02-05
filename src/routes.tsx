import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import VerifyEmail from "./pages/signup/verify";
import Home from "./pages/home";
import CreatePost from "./pages/post";
import Myphotos from "./pages/myphotos";
import Search from "./pages/search";
import SearchPost from "./pages/search/posts";
import Users from "./pages/search/users";
import SingleUser from "./pages/search/users/user"
import Error from "./pages/error";
import ProtectedRoutes from "./components/ProtectedRoutes";
import EditProfile from "@/pages/profile/editProfile.tsx";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <Error />
      },
      {
        path: "/search",
        element: <Search />,
        errorElement: <Error />
      },
      {
        path: "/search/posts",
        element: <SearchPost />,
        errorElement: <Error />
      },
      {
        path: "/search/users",
        element: <Users />,
        errorElement: <Error />
      },
       {
        path: "/search/users/user",
        element: <SingleUser />,
        errorElement: <Error />
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <Error />
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
        errorElement: <Error />
      },
      {
        path: "/myphotos",
        element: <Myphotos />,
        errorElement: <Error />
      },
    ],
  },
  {
    path: "/post",
    element: <CreatePost />,
    errorElement: <Error />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <Error />
  },
  {
    path: "/signup/verify",
    element: <VerifyEmail />,
    errorElement: <Error />
  }
]);

export default router;
