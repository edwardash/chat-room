import React from "react";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Join from "./components/Join/Join";
import './App.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Join />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);


function App() {
  return (
    <>
      <RouterProvider router={router} />

    </>
  );
}

export default App;
