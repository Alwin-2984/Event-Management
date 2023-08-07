import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import AuthGuard from "./Auth/AuthGuard";
import LoginAuth from "./Auth/LoginAuth";

const UserLayout = lazy(() => import("./screens/User/Dashboard/UserLayout"));
const NotFound = lazy(() => import("./screens/Components/NotFound404"));
const LoginOrganiser = lazy(() =>
  import("./screens/Organiser/Login/LoginOrganiser")
);
const OrganizerLayout = lazy(() =>
  import("./screens/Organiser/Dashboard/OrganizerLayout")
);
const BookedEvents = lazy(() => import("./screens/User/BookedEvents"));
const OrganiserDashboard = lazy(() =>
  import("./screens/Organiser/Dashboard/OrganiserDashboard")
);
import UserDashboard from "./screens/User/Dashboard/UserDashboard";
import "./routes.css";
import EventDetailedPage2ndTheme from "./screens/User/EventDetailedPage/EventDetailedPage2ndTheme";
import EventDetailedPage3rdTheme from "./screens/User/EventDetailedPage/EventDetailedPage3rdTheme";
import EventDetailedPage1thTheme from "./screens/User/EventDetailedPage/EventDetailedPage1thTheme";
import EventDetailedPag4thLayout from "./screens/User/EventDetailedPage/EventDetailedPag4thLayout";

export default function Routes() {
  return (
    <Suspense fallback={<div id="loader" />}>
      {useRoutes([
        {
          path: "/Organiser",
          element: (
            <AuthGuard>
              <OrganizerLayout />
            </AuthGuard>
          ),
          children: [
            { element: <Navigate to="app" />, index: true },
            {
              path: "app",
              element: <OrganiserDashboard />,
              index: true,
            },
            {
              path: "UpcomingEvent",
              element: <BookedEvents />,
              index: true,
            },
          ],
        },
        {
          path: "/dashboard",
          element: <UserLayout />,
          children: [
            { element: <Navigate to="home" />, index: true },
            { path: "home", element: <UserDashboard />, index: true },
            {
              path: "book",
              element: <EventDetailedPage1thTheme />,
              index: true,
            },
            {
              path: "BookedEventsPro",
              element: <EventDetailedPage3rdTheme />,
              index: true,
            },
            {
              path: "eventDetailedView",
              element: <EventDetailedPage2ndTheme />,
              index: true,
            },
            {
              path: "Layout4",
              element: <EventDetailedPag4thLayout />,
              index: true,
            },
            {
              path: "eventDetailedView2ndTheme",
              element: <EventDetailedPage2ndTheme />,
              index: true,
            },
          ],
        },
        {
          path: "/organizerLogin",
          element: (
            <LoginAuth>
              <LoginOrganiser />
            </LoginAuth>
          ),
        },
        {
          path: "*",
          element: <NotFound replace />,
          index: true,
        },
      ])}
    </Suspense>
  );
}
