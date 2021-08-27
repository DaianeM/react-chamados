import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AuthProvider from './contexts/auth';

import Routes from './routes';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={ 3000 }/>
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
