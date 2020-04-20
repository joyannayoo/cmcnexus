import styled from "styled-components";

import { RedButton } from "../../styles/Buttons";

export const DetailsContainer = styled.div`
  height: auto;
  padding: 20px;
  margin-bottom: 30px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  display: flex;
  flex-direction: column;
`;

export const DetailsHeader = styled.div`
  display: flex;
  padding: 5px;
`;

export const DetailsKey = styled.div`
  width: 10%;
  min-width: 150px;
  color: #777;
`;

export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Stripe = styled.div`
  width: auto;
  color: red;
  font-weight: bold;
  font-size: 20px;
  border-radius: 5px;
  padding: 5px 0px 5px 0px;
  text-transform: uppercase;
  display: flex;
  align-self: end;
`;

export const Match = styled(RedButton)`
  width: 225px;
`;
