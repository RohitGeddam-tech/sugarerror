import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Main from './layouts/MainLayout';
import ReactGA from "react-ga";

function App(props) {
  let pathName = window.location.pathname;
  let Search = window.location.search;

  useEffect(() => {
    ReactGA.initialize(`${process.env.REACT_APP_GA_ID}`);
    ReactGA.pageview(pathName + Search);
  }, [pathName, Search]);

  let [online, isOnline] = useState(navigator.onLine);

  const setOnline = () => {
    console.log('We are online!');
    isOnline(true);
  };
  const setOffline = () => {
    console.log('We are offline!');
    isOnline(false);
  };

  useEffect(() => {
    window.addEventListener('offline', setOffline);
    window.addEventListener('online', setOnline);

    return () => {
      window.removeEventListener('offline', setOffline);
      window.removeEventListener('online', setOnline);
    }
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <Route path={'/'} render={props => <Main {...props} online={online} />} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
