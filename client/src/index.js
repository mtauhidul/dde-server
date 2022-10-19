import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Details from './pages/Details';
import ErrorPage from './pages/ErrorPage';
import Result from './pages/Result';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/result',
    element: <Result />,
  },
  {
    path: '/details/:id',
    element: <Details />,
  },
]);

// Create Context API
export const DataContext = React.createContext();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataContext.Provider value={[]}>
      <RouterProvider router={router} />
    </DataContext.Provider>
  </React.StrictMode>
);
