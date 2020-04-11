import React from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import {PrivateRoute} from '../components/PrivateRoute';

import UnderConstruction from '../components/UnderConstruction';
import {Login} from '../components/Login';
import LandingPage from '../components/LandingPage'
import Navigation from '../components/Navigation';
import ListCases from "../components/ListCases";
import ListOrganisations from '../components/ListOrganisations';
import AddOrganisation from "../components/AddOrganisation";



export default function Routes() {
    return (
      <Router>
        <Switch>
          <Route path='/login' component={Login}/>
          <Navigation>
            <PrivateRoute path='/' exact component={LandingPage}/>
            {/*<PrivateRoute exact path='/cases/add/' component={AddOrganisation}/>*/}
            <PrivateRoute exact path='/cases/' component={ListCases}/>
            <PrivateRoute exact path='/organisations/add/' component={AddOrganisation}/>
            <PrivateRoute exact path='/organisations/' component={ListOrganisations}/>
          </Navigation>
          <Route path='/' component={UnderConstruction}/>
        </Switch>
      </Router>
    )
}
