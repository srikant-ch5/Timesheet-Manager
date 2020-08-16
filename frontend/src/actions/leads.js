import axios from "axios";
import { GET_LEADS, DELETE_LEAD, ADD_LEAD, EDIT_LEAD } from "./types";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

//GEt_LEADS
export const get_leads = () => (dispatch, getState) => {
  axios
    .get("/api/leads/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_LEADS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//DELETE LEAD
export const deleteLead = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/leads/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteLead: "Lead Deleted" }));
      dispatch({
        type: DELETE_LEAD,
        payload: id,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD LEAD
export const addLead = (lead) => (dispatch, getState) => {
  axios
    .post(`/api/leads/`, lead, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addLead: "Lead Added" }));
      dispatch({
        type: ADD_LEAD,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//edit a particular lead
export const editLead = (lead) => (dispatch, getState) => {
  const { id, name, email, message } = lead;
  const editedLead = { name, email, message };
  axios
    .patch(`/api/leads/${id}/`, editedLead, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ editLead: "Lead Edited" }));
      dispatch({
        type: EDIT_LEAD,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
