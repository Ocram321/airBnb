

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import SpotList from './components/Home/SpotList'
import SpotDetails from './components/SpotInfo';
import ManageSpots from './components/ManageSpots';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import AddSpotForm from './components/AddSpot';
import UpdateSpotForm from './components/UpdateSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotList/>
      },
      {
        path: '/spots/new',
        element: <AddSpotForm />
      },
      {
        path: '/spots/:id',
        element: <SpotDetails />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm/>
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;