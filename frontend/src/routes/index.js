import React from 'react';

import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import {PrivateRoute, PrivateRoutePerm} from '../components/PrivateRoute';

import UnderConstruction from '../components/UnderConstruction';
import {Login} from '../components/Login';
import LandingPage from '../components/LandingPage'
import Navigation from '../components/Navigation';
import ListCases from "../components/ListCases";
import AddCase from "../components/AddCase";
import ListOrganisations from '../components/ListOrganisations';
import AddOrganisation from "../components/AddOrganisation";
import CaseDetails from "../components/CaseDetails";
import {ADD_CASE, ADD_ORGANISATION, VIEW_CASE, VIEW_ORGANISATION} from '../components/Permissions/permissions';
import MatchOrganisations from '../components/MatchOrganisations';



export default function Routes() {
    return (
      <Router>
        <Switch>
          <Route path='/login' component={Login}/>
          <PrivateRoute path='/404' component={UnderConstruction}/>

          <Navigation>
              <Route exact path="/" render={() => <Redirect to='/dashboard'/>} />
              <PrivateRoute path='/dashboard/' component={() => <div>Hallo Welt</div>}/>
              <PrivateRoutePerm exact path='/cases/add/' component={AddCase} permission={ADD_CASE}/>
              <PrivateRoutePerm exact path='/cases/details/:id/' component={CaseDetails} permission={VIEW_CASE}/>
              <PrivateRoutePerm exact path='/cases/' component={ListCases} permission={VIEW_CASE}/>
              <PrivateRoutePerm exact path='/organisations/add/' component={AddOrganisation} permission={ADD_ORGANISATION}/>
              <PrivateRoutePerm exact path='/organisations/' component={ListOrganisations} permission={VIEW_ORGANISATION}/>
              <PrivateRoute exact path='/organisations/match' component={MatchOrganisations}/>
              <Route path="/" render={() => <Redirect to='/dashboard'/>} />
          </Navigation>
        </Switch>
      </Router>
    )
}
