import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { casesFunction } from "../../store/actions/casesAction";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function CaseDetails(props) {
  useEffect(() => {
    props.dispatch(casesFunction());
  }, []);

  const caseDetails = props.cases
    ? props.cases.find((file) => file.id == props.match.params.id)
    : null;

  return (
    <Container>
      {caseDetails ? (
        <>
          <div>title: {caseDetails.title}</div>
          <div>description: {caseDetails.description}</div>
          <div>diagnosis: {caseDetails.diagnosis}</div>
          <div>justification: {caseDetails.justification}</div>
          <div>recommendation: {caseDetails.recommendation}</div>
          <div>consent: {caseDetails.consent}</div>
          <div>age: {caseDetails.age}</div>
          <div>sex: {caseDetails.sex}</div>
          <div>country: {caseDetails.country}</div>
          <div>category: {caseDetails.category}</div>
          <div>outcome: {caseDetails.outcome}</div>
          <div>
            matched partners:{" "}
            {caseDetails
              ? caseDetails.matched_partners.map((partner) => {
                  return (
                    <div key={partner.id}>
                      <b>{partner.name}</b>
                    </div>
                  );
                })
              : null}
          </div>
          <div>
            assigned partners:{" "}
            {caseDetails
              ? caseDetails.assigned_partners.map((partner) => {
                  return (
                    <div key={partner.id}>
                      <b>{partner.name}</b>
                    </div>
                  );
                })
              : null}
          </div>
          <div>status: {caseDetails.status}</div>
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
  };
};

export default connect(mapStateToProps)(CaseDetails);
