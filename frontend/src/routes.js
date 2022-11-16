import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";

const routes = [
  {
    path: "",
    element: <Login />,
  },
  {
    path: ":userId",
    element: <Dashboard />,
  },
  {
    path: ":userId/:id",
    element: <Collection />,
  },
];

export default routes;
