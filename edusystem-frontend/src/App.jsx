import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import PartBWorkspace from './pages/PartBWorkspace';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(readStoredUser());

  const handleAuthenticated = (authUser) => {
    setUser(authUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return <PartBWorkspace user={user} onLogout={handleLogout} />;
}

export default App;
