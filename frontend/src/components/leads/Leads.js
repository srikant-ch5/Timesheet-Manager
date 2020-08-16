import React, { Component, Fragment, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get_leads, deleteLead, editLead } from "../../actions/leads";

export class Leads extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      inventoryData: [],
      inEditMode: {
        status: false,
        rowKey: null,
      },
      unitPrice: null,
      leadMessage: "",
    };

    const API_HOST = "http://localhost:3000";
    const INVENTORY_API_URL = `${API_HOST}/inventory`;
  }

  static propTypes = {
    leads: PropTypes.array.isRequired,
    get_leads: PropTypes.func.isRequired,
    deleteLead: PropTypes.func.isRequired,
  };

  onEdit = ({ id, currentUnitPrice }) => {
    this.setState({
      inEditMode: {
        status: true,
        rowKey: id,
      },
      unitPrice: currentUnitPrice,
    });
  };

  onEditMessage = ({ leadId, leadMessage }) => {
    console.log(`User wants to change ${leadId} message to ${leadMessage}`);
    this.setState({
      inEditMode: {
        status: true,
        rowKey: leadId,
      },
      leadMessage,
    });
  };

  onChangeMessage = () => {};

  updateInventory = ({ id, newUnitPrice }) => {
    fetch(`${this.INVENTORY_API_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        unit_price: newUnitPrice,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        this.onCancel();
        this.fetchInventory();
      });
  };

  onCancel = () => {
    console.log("Cancel has been clicked");
    this.setState({
      inEditMode: {
        status: false,
        rowKey: null,
      },
      unitPrice: null,
    });
  };

  onSave = ({ id, name, email, message }) => {
    const leadToEdit = { id, name, email, message };
    this.props.editLead(leadToEdit);
    this.onCancel();
    this.props.get_leads();
  };

  componentDidMount() {
    this.props.get_leads();
    this.setState({ leadEditMode: true });
    this.fetchInventory();
  }

  editLeadClick = (leadId) => {
    console.log("The lead id clicked to edit is " + leadId);
  };

  fetchInventory = () => {
    fetch("http://localhost:3000/inventory")
      .then((res) => res.json())
      .then((json) => this.setState({ data: json }));

    console.log(`${this.state.data}`);
  };

  render() {
    return (
      <Fragment>
        <h2>Timesheet Entries</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.id}</td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>
                  {this.state.inEditMode.status &&
                  this.state.inEditMode.rowKey == lead.id ? (
                    <input
                      onChange={(event) =>
                        this.setState({ leadMessage: event.target.value })
                      }
                      value={this.state.leadMessage}
                    />
                  ) : (
                    lead.message
                  )}
                </td>
                <td>
                  {this.state.inEditMode.status &&
                  this.state.inEditMode.rowKey === lead.id ? (
                    <Fragment>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          this.onSave({
                            id: lead.id,
                            name: lead.name,
                            email: lead.email,
                            message: this.state.leadMessage,
                          });
                        }}
                      >
                        Save
                      </button>
                      <button
                        style={{ marginLeft: 8 }}
                        className="btn btn-secondary"
                        onClick={this.onCancel}
                      >
                        Cancel
                      </button>
                    </Fragment>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        this.onEditMessage({
                          leadId: lead.id,
                          leadMessage: lead.message,
                        });
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={this.props.deleteLead.bind(this, lead.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  leads: state.leads.leads,
});
export default connect(mapStateToProps, { get_leads, deleteLead, editLead })(
  Leads
);
