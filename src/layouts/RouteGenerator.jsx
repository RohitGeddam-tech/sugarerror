import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

function RouteGenerator(props) {
  return (
    <>
      <Switch>
        {props.routes.filter((route)=> !(route.excludeRole?.length && route.excludeRole.includes(props.mainRole))).map((route, key) => {
          const Component = route.component;
          if (route.redirect)
            return (
              <Route
                key={key}
                path={route.path}
                exact={route.exact}
                render={() => {
                  return <Redirect to={route.pathTo} />;
                }}
              />
            );
          return (
            <Route
              key={key}
              exact={route.exact}
              path={route.path}
              render={routeProps => <Component {...routeProps} sideBarState={props.sideBarState} />}
            />
          );
        })}
      </Switch>
    </>
  );
}

export default RouteGenerator;
