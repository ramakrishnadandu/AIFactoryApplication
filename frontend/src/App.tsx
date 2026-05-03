import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

// Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;

// About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div>
      <h1>About Page</h1>
    </div>
  );
};

export default About;

// NotFound.tsx
import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
    </div>
  );
};

export default NotFound;