import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import Home from "./pages/home";

const NotFound404 = () => (
  <div>
    <h1>Page could not be found :(</h1>
  </div>
)

const client = new ApolloClient({
  link: new HttpLink({
    credentials: "same-origin",
  }),
  cache: new InMemoryCache() as any,
});

ReactDOM.render(
  (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          {/* always keep this last */ /* tslint:disable-line */ }
          <Route path="*" component={NotFound404} />
        </Switch>
      </Router>
    </ApolloProvider>
  ),
  document.getElementById("app"),
);