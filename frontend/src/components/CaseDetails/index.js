import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import { casesFunction } from "../../store/actions/Cases/casesAction";
import Validation from "../Validation";
import {RedAddText, RedButton} from "../../styles/Buttons";
import {
  Horizontal,
} from "./styles";
import CanI from "../Permissions";
import { setNavigationAction } from "../../store/actions/Navigation";
import { CASES } from "../Navigation/states";
import {
  VALIDATE_CASE,
  MATCH_ORGANISATIONS,
  UPDATE_MATCH,
  CHANGE_CASE,
  CLOSE_CASE,
  DELETE_CASE
} from "../Permissions/permissions";
import AcceptCase from "../AcceptCase";
import RejectCase from "../RejectCase";
import CloseCase from "../CloseCase";
import styled from "styled-components";
import {Container, DetailsContainer, HeaderTitle, HeaderTitleWrapper} from "../../styles/BaseContainer";
import {Stripe, DetailsHeader, DetailsKey, DetailsValue, StatusDetailsValue} from "../../styles/Details";
import DeleteCase from "../DeleteCase";
import {Empty} from "../../styles/GenericBoxes";
import {
  Table,
  TableBody,
  TableData,
  TableHeader,
  TableHeaderRow,
  TableHeaderWrapper,
  TableRow
} from "../../styles/Tables";

const StatusButtonsContainer = styled.div`
  display: flex;
  fllex-direction: row;
  justify-content: flex-start;
  align-content: center;
`;

const StatusDetailsValueOrgs = styled(StatusDetailsValue)`
margin: 20px 0 0 0;
flex-grow: 1;
`;

const Spacer = styled.div`
width: 1%;
`;

const Match = styled(RedButton)`
  width: 225px;
 height: 40px;
`;

export const RedText = styled.div`
  font-size: 18px;
  color: red;
  vertical-align: middle;
  margin: 0 10px;
`;

export const CloseReason = styled.div`
  font-size: 16px;
  color: red;
  margin: 0 10px;
`;

function CaseDetails(props) {
  const dispatch = props.dispatch;
  const caseDetails = props.cases
    ? props.cases.find((file) => file.id === Number(props.match.params.id)) : null;
  const partnership = Boolean(props.user && props.user.organisation && caseDetails)
      ? props.user.organisation.partnered_cases.find(cse => cse.case === caseDetails.id) : null;
  const partnership_status = partnership ? partnership.status : null;

  useEffect(() => {
    dispatch(casesFunction());
    dispatch(setNavigationAction(CASES));
  }, [dispatch]);

  const matchingHandler = (id) => {
        props.history.push({
            pathname: `/cases/match/${id}`,
          });
    };

  const editCaseHandler = () => {
        props.history.push(`/cases/edit/${caseDetails.id}/`)
    };


  return (
    <Container>
      {caseDetails ? (
        <>
          <HeaderTitleWrapper>
            <HeaderTitle>Case Details of {caseDetails.title}</HeaderTitle>
            <Horizontal>
              <CanI perform={CHANGE_CASE}>
               <RedAddText onClick={editCaseHandler}>✎ Edit</RedAddText>
              </CanI>
              <CanI perform={DELETE_CASE}>
                <CanI perform={CHANGE_CASE}>
                 <RedText> | </RedText>
                </CanI>
              </CanI>
              <CanI perform={DELETE_CASE}>
                <DeleteCase singleCase={caseDetails} />
              </CanI>
            </Horizontal>
          </HeaderTitleWrapper>
          <Stripe>Status</Stripe>
          <DetailsContainer>
            <DetailsHeader>
              <DetailsKey>Status</DetailsKey>
              {partnership_status  && caseDetails.status === "open" ?
                  <StatusDetailsValue status={partnership_status}>{partnership_status}</StatusDetailsValue>
                  : <StatusDetailsValue status={caseDetails.status}>{caseDetails.status}</StatusDetailsValue>
              }{
                caseDetails.status === "closed" ?
                      <CloseReason>{caseDetails.closing_reason}</CloseReason>
                    : null
                }
              <Empty/>
              <StatusButtonsContainer>
                {caseDetails.status === "requested" ? (
                    <CanI perform={VALIDATE_CASE}>
                      <Validation id={caseDetails.id}/>
                    </CanI>
                ) : null}
                {caseDetails.status === "open" ? (
                    <>
                      <CanI perform={MATCH_ORGANISATIONS}>
                        <Spacer/>
                        <Match onClick={() => matchingHandler(caseDetails.id)}>
                          FIND ORGANISATIONS
                        </Match>
                      </CanI>
                      <CanI perform={UPDATE_MATCH}>
                        <Spacer/>
                        <AcceptCase singleCase={caseDetails}/>
                        <Spacer/>
                        <RejectCase singleCase={caseDetails}/>
                      </CanI>
                    </>
                ) : null}
                {
                  caseDetails.status !== "requested"?(
                  <CanI perform={CLOSE_CASE}>
                    <Spacer/>
                    <CloseCase caseDetails={caseDetails}/>
                  </CanI>
                  ): null}
              </StatusButtonsContainer>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Organisations Progress</DetailsKey>
              <StatusDetailsValueOrgs>
                <Table>
                  <TableHeaderWrapper>
                    <TableHeaderRow>
                      {caseDetails.match_stats ?
                          caseDetails.match_stats.map(stat => {
                            return (
                                <TableHeader key={stat.status}>
                                  {stat.status}
                                </TableHeader>
                            );
                          })
                          : null}
                    </TableHeaderRow>
                  </TableHeaderWrapper>
                  <TableBody>
                    <TableRow>
                      {caseDetails.match_stats ?
                          caseDetails.match_stats.map(stat => {
                            return (
                                <TableData key={stat.status}>
                                  <b>{stat.count}</b>
                                </TableData>
                            );
                          })
                          : null}
                    </TableRow>
                  </TableBody>
                </Table>
              </StatusDetailsValueOrgs>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Outcome</DetailsKey>
              <StatusDetailsValue>{caseDetails.outcome}</StatusDetailsValue>
            </DetailsHeader>
          </DetailsContainer>
          <Stripe>Patient's details</Stripe>
          <DetailsContainer>
            <DetailsHeader>
              <DetailsKey>Title</DetailsKey>
              <DetailsValue>
              {caseDetails.title}
              </DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Patient ID</DetailsKey>
              <DetailsValue>{caseDetails.patient_id}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Language</DetailsKey>
              <DetailsValue>{caseDetails.language}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Nature of Referral</DetailsKey>
              <DetailsValue>{caseDetails.nature_of_referral}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Age</DetailsKey>
              <DetailsValue>{caseDetails.age}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Date of Birth</DetailsKey>
              <DetailsValue>{caseDetails.birth_date}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Sex</DetailsKey>
              <DetailsValue>{caseDetails.sex}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Location</DetailsKey>
              <DetailsValue>{caseDetails.location}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Country</DetailsKey>
              <DetailsValue>{caseDetails.country}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Consent</DetailsKey>
              <DetailsValue>
              {caseDetails.consent ? "Yes" : "No"}
              </DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Category</DetailsKey>
              <DetailsValue>
                {caseDetails
                  ? caseDetails.categories.map((category) => category.name).join(', ')
                  : null}
              </DetailsValue>
            </DetailsHeader>
          </DetailsContainer>
          <Stripe>Medical details</Stripe>
          <DetailsContainer>
            <DetailsHeader>
              <DetailsKey>Presenting Complaint</DetailsKey>
              <DetailsValue>{caseDetails.description}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>History of Presenting Complaint</DetailsKey>
              <DetailsValue>{caseDetails.history_description}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Past Medical History</DetailsKey>
              <DetailsValue>{caseDetails.past_medical_history}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Diagnosis</DetailsKey>
              <DetailsValue>{caseDetails.diagnosis}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Physical examination</DetailsKey>
              <DetailsValue>{caseDetails.physical_examination}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Investigations</DetailsKey>
              <DetailsValue>{caseDetails.investigations}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Current treatment</DetailsKey>
              <DetailsValue>{caseDetails.current_treatment}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Justification</DetailsKey>
              <DetailsValue>{caseDetails.justification}</DetailsValue>
            </DetailsHeader>
            <DetailsHeader>
              <DetailsKey>Recommendation</DetailsKey>
              <DetailsValue>{caseDetails.recommendation}</DetailsValue>
            </DetailsHeader>
          </DetailsContainer>
        </>
      ) : (
        <div>No case to show</div>
      )}
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    cases: state.cases,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(CaseDetails);
