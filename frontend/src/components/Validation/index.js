import React, { Component } from 'react'
import { connect } from "react-redux";
import { RedButton } from '../../styles/Buttons';
import styled from 'styled-components';
import {validateCaseFunction} from '../../store/actions/updateCaseAction';
import {rejectCaseFunction} from '../../store/actions/rejectCaseAction';


const ButtonContainer = styled.div`
display: flex; 
justify-content: center; 
margin-top: 3%; 
`

const Button = styled(RedButton)`
 height: 50px;
 width: 100px; 
 margin: 3%;    
`


class Validation extends Component {

    acceptHandler = async() => {
        await this.props.dispatch(validateCaseFunction(this.props.id))
    }

    rejectHandler = async() => {
        await this.props.dispatch(rejectCaseFunction(this.props.id))
    }

    render() {
        return (
            <ButtonContainer>
                <Button onClick={this.acceptHandler}>Accept</Button> 
                <Button onClick ={this.rejectHandler}>Reject</Button> 
            </ButtonContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      cases: state.cases
    };
  };
  
  export default connect(mapStateToProps)(Validation);
