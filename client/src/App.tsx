import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Todos from './pages/Todos';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (loading) {
      console.log("Application loading...");
    }
  }, [loading]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <AuthProvider>
        <TodoProvider>
          <ChatProvider>
            {isAuthenticated ? (
              <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-4 overflow-y-auto">
                    <Switch>
                      <ProtectedRoute path="/todos" component={Todos} />
                      <ProtectedRoute path="/chat" component={Chat} />
                      <Redirect from="/" to="/todos" />
                    </Switch>
                  </main>
                </div>
              </div>
            ) : (
              <Switch>
                <Route path="/login" component={Login} exact />
                <Route path="/register" component={Register} exact />
                <Redirect from="/" to="/login" />
              </Switch>
            )}
          </ChatProvider>
        </TodoProvider>
      </AuthProvider>
    </Router>
  );
};

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuthContext();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default App;