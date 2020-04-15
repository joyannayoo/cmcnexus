import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RedButton } from "../../styles/Buttons";
import { organisationsFunction } from "../../store/actions/organisationsAction";
import { matchOrganisationsFunction, unmatchOrganisationsFunction } from "../../store/actions/matchOrganisationsAction";
import { assignOrganisationsFunction, unassignOrganisationsFunction } from "../../store/actions/assignOrganisationsAction";
import {
  Table,
  TableBody,
  TableData,
  TableHeader,
  TableHeaderRow,
  TableHeaderWrapper,
  TableRow,
} from "../../styles/Tables";
import styled from "styled-components";


  const MatchAssignButton = styled(RedButton)`
    width: 150px;
    height: 40px;
    margin: 25px 50px;
    border: none;
    background-color: ${(props) => props.clicked ? "#e60000" : "#009933"};
    transition: all 0.7s ease;
    :hover {
        cursor: pointer;
        opacity: 0.8;
    }
  `;

  const NotAccepted = styled.p`
    color: #e60000;
    padding: 35px;
  `;

function MatchActionable(props) {
  const match = () => {
    props.dispatch(matchOrganisationsFunction(props.singleCase.id, props.organisationId));
  };
  const unmatch = () => {
    props.dispatch(unmatchOrganisationsFunction(props.singleCase.id, props.organisationId));
  };
  return <>{
    props.singleCase.matched_partners.some((org) => org.id === props.organisationId)
        ? <MatchAssignButton onClick={unmatch} clicked={true}>Unmatch</MatchAssignButton>
        : <MatchAssignButton onClick={match}>Match</MatchAssignButton>
  }</>;
}

function AssignActionable(props) {
  const assign = () => {
    props.dispatch(assignOrganisationsFunction(props.singleCase.id, props.organisationId));
  };
  const unassign = () => {
    props.dispatch(unassignOrganisationsFunction(props.singleCase.id, props.organisationId));
  };
  return <>{
     props.singleCase.accepted_partners.some((org) => org.id === props.organisationId)
      ? props.singleCase.assigned_partners.some((org) => org.id === props.organisationId)
        ? <MatchAssignButton onClick={unassign} clicked={true}>Unassign</MatchAssignButton>
        : <MatchAssignButton onClick={assign}>Assign</MatchAssignButton>
      : <NotAccepted>The case has not been accepted.</NotAccepted>
  }</>;
}

function MatchAssignOrg(props) {
  const dispatch = props.dispatch;
  const singleCase = props.cases.find((c) => c.id === props.caseId);
  console.log(singleCase)

  useEffect(() => {
    dispatch(organisationsFunction());
  }, [dispatch]);


  const filteredOrganisations = () => {
    return singleCase ? props.organisations.filter(
      org => org.category ? org.category.id === Number(singleCase.category) : false) : []
  }

  const headers = ["Name", "Description", "Category", "Tag(s)"];

  return (
      <Table>
        <TableHeaderWrapper>
          <TableHeaderRow>
            {headers.map((header) => {
              return <TableHeader key={header}>{header}</TableHeader>;
            })}
          </TableHeaderRow>
        </TableHeaderWrapper>
        <TableBody>
          {filteredOrganisations()
            ? filteredOrganisations().map((organisation) => {
                return (
                  <TableRow key={organisation.id}>
                    <TableData>{organisation.name}</TableData>
                    <TableData>{organisation.description}</TableData>
                    <TableData>{organisation.category.name}</TableData>
                    <TableData>{organisation.tag}</TableData>
                    <TableData>
                      <MatchActionable dispatch={props.dispatch} organisationId={organisation.id} singleCase={singleCase}/>
                    </TableData>
                    <TableData>
                      <AssignActionable dispatch={props.dispatch} organisationId={organisation.id} singleCase={singleCase}/>
                    </TableData>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
  );
}

const mapStateToProps = (state) => {
  return {
    organisations: state.organisations,
    cases: state.cases
  };
};

export default connect(mapStateToProps)(MatchAssignOrg);