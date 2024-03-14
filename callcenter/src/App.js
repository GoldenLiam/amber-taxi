import './App.css';
import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import { routes } from './routes';
import DefaultFragment from './components/DefaultFragment/DefaultFragment';
import { SocketCallingContextProvider } from './sockets/SocketCallingContext';
import CallingNotification from './components/Calling/CallingNotification';

function App() {

  return (
    <div>
      <SocketCallingContextProvider>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const Layout = route.isShowSideNav ? DefaultFragment : Fragment
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
        <CallingNotification />
      </SocketCallingContextProvider>
    </div>
  );
}

export default App;
