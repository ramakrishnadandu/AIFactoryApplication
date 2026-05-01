import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from './contexts/UserContext';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import GreetingDashboard from './components/GreetingDashboard';
import ReportError from './components/ReportError';
import './styles.css';

// Create a custom theme for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/greetings" element={<GreetingDashboard />} />
            <Route path="*" element={<ReportError message="404 - Page not found" />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

// Error boundary to catch any rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, { hasError: boolean }> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ReportError message="Something went wrong." />;
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default App;