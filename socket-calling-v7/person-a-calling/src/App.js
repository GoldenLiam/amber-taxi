import logo from './logo.svg';
import './App.css';
import CallingPage from './pages/CallingPage';
import { SocketCallingContextProvider } from './sockets/SocketCallingContext';

function App() {
  return (

    <SocketCallingContextProvider>
      <CallingPage/>
    </SocketCallingContextProvider>

  );
}

export default App;
