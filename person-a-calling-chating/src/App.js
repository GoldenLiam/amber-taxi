import logo from './logo.svg';
import './App.css';
import CallingPage from './pages/CallingPage';
import { SocketCallingContextProvider } from './sockets/SocketCallingContext';

import { SocketChatingContextProvider } from './sockets/SockerChatingContext';

import ChatingPage from './pages/ChatPage';

function App() {
  return (

    <SocketCallingContextProvider>
      <CallingPage/>

      <SocketChatingContextProvider>
        <ChatingPage/>
      </SocketChatingContextProvider>
      
    </SocketCallingContextProvider>

  );
}

export default App;
