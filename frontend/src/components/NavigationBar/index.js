import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useHistory } from "react-router-dom";
import dashboard from '../../assets/output-onlinepngtools.png'
import folder from '../../assets/cases.png'
import organisation from '../../assets/organization.png'
import msf_logo from '../../assets/MSF_logo_international_small.jpg'
import propulsion_logo from '../../assets/Propulsion_LogoText_horizontalSwiss_Logo Kopie.png'
import userprofile from '../../assets/userprofile.png'
import {
  NavigationContainer, Logo, Options,
  Button, NavItem, OptionsWrapper, Title
} from './style';
import {logoutAction} from '../../store/actions/Authentication/loginActions';
import CanI from '../Permissions';
import {Empty} from '../../styles/GenericBoxes';
import {CASES, DASHBOARD, ORGANISATIONS, USERPROFILE} from '../Navigation/states';
import {setNavigationAction} from '../../store/actions/Navigation';
import {VIEW_CASE, VIEW_DASHBOARD, VIEW_ORGANISATION} from '../Permissions/permissions';


function NavigationBar() {
  const dispatch = useDispatch();
  const history = useHistory();
  const selected = useSelector(state => state.navigation);

  const logoutHandler = () => {
    dispatch(logoutAction());
    history.push({
      pathname: "/login",
      state: { from: "/" }
    });
  };

  const onClickHandler = navigationTarget => {
    dispatch(setNavigationAction(navigationTarget));
    history.push(`/${navigationTarget}/`);
  };

  return (
    <NavigationContainer>
      <Logo src={msf_logo} onClick={() => onClickHandler(CASES)}/>
      <Title>CMC Nexus</Title>
      <OptionsWrapper />
      <Options>
        <CanI perform={VIEW_DASHBOARD}>
        <NavItem selected={selected===DASHBOARD} onClick={() => onClickHandler(DASHBOARD)}>
          <img src={dashboard} alt="Dashboard" style={{paddingRight: 35, height: 45}}/>
          Dashboard
        </NavItem>
        </CanI>
        <CanI perform={VIEW_CASE}>
          <NavItem selected={selected===CASES} onClick={() => onClickHandler(CASES)}>
            <img src={folder} alt="Cases" style={{paddingRight: 35, height: 45}}/>
            Cases
          </NavItem>
        </CanI>
        <CanI perform={VIEW_ORGANISATION}>
          <NavItem selected={selected===ORGANISATIONS} onClick={() => onClickHandler(ORGANISATIONS)}>
            <img src={organisation} alt="Organisations" style={{paddingRight: 35, height: 45}}/>
            Organisations
          </NavItem>
        </CanI>
        <NavItem selected={selected===USERPROFILE} onClick={() => onClickHandler(USERPROFILE)}>
          <img src={userprofile} alt="User Profile" style={{paddingRight: 35, height: 45}}/>
          Profile
        </NavItem>
      </Options>
      <OptionsWrapper/>
      <Empty/>
      <Button onClick={logoutHandler}>Log out</Button>
    </NavigationContainer>
  );
}

export default NavigationBar;
