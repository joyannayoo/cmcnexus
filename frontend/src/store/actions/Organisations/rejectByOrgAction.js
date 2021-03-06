import {UPDATE_CASE} from "../actionTypes";
import Axios from "../../../axios/authenticated";
import {getCurrentUser} from "../Authentication/userActions";

const updateCaseAction = (file) => {
  return {
    type: UPDATE_CASE,
    payload: file,
  };
};

export const rejectCaseByOrgFunction = (caseId, orgId) => async (dispatch) => {
  const response = await Axios.post(`cases/${caseId}/refuse/`, {partner_ids: orgId});
  dispatch(updateCaseAction(response.data));
  dispatch(getCurrentUser(orgId));
};

export const unrejectCaseByOrgFunction = (caseId, orgId) => async (dispatch) => {
  const response = await Axios.delete(`cases/${caseId}/refuse/`, {data: {partner_ids: orgId}});
  dispatch(updateCaseAction(response.data));
  dispatch(getCurrentUser(orgId));
};