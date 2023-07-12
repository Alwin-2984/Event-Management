import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './screens/User/Dashboard';
import About from './components/About';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/about" component={About} /> */}
        {/* <Route component={NotFound} /> */}
      </Switch>
    </Router>
  );
}

export default App;
