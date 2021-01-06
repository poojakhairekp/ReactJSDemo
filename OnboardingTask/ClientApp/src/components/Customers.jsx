import React, { Component } from 'react';
//import Modal from 'react-modal';
import { Button, Modal, Header } from 'semantic-ui-react';
import $ from 'jquery';


const inlineStyle = {
    modal: {
        height: 'auto',
        top: 'auto',
        left: 'auto',
        bottom: 'auto',
        right: 'auto',
    }
};

export class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Customers: [],
            name: "",
            address: "",
            id: "",
            nameErrors: "",
            addressErrors: "",
            nameisvalid: false,
            addressisvalid: false,
            isModalOpen: false,
            isDeleteModalOpen: false,
            modalName: "Create Customer",
            buttonName:"Create"
        };
        this.handleSave = this.handleSave.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    deleteRecord() {
        $.ajax({
            url: '/api/Customers/' + this.state.id,
            type: 'DELETE',
            success: (data) => {
                window.alert("The customer record is deleted successfully!");
            },
            error: (error) => {
                window.alert("The customer records can not be deleted. It must appear in Sale records.")
            }
        })
        window.location.reload();
    }

    componentDidMount() {
        $.ajax({
            url: '/api/Customers',
            method: 'GET',
            success: (data) => {
                console.log("data" + data)
                this.setState({ Customers: data })
            },
            error: function (error) {
                console.log(error)
            }
        })
    }


    handleEdit(data) {
        this.setState({ buttonName:"Edit", id: data.id, name: data.name, address: data.address, isModalOpen: true, modalName: "Edit Customer" });
    }

    handleSave(event) {
        if (this.state.id != 0) {
            $.ajax({
                url: '/api/Customers/' + this.state.id,
                type: 'PUT',
                data: JSON.stringify({
                    id: this.state.id,
                    name: this.state.name,
                    address: this.state.address
                }),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                success: (data) => {
                    console.log("data" + data)
                    window.location.reload();
                },
                error: function (error) {
                    console.log(error)
                }
            })
        }
        else {
            $.ajax({
                url: '/api/Customers',
                type: 'POST',
                data: JSON.stringify({
                    name: this.state.name,
                    address: this.state.address
                }),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                success: (data) => {
                    console.log("data" + data)
                    window.location.reload();
                },
                error: function (error) {
                    console.log(error)
                }
            })
        }
    }

    closeModal() {
        this.setState({ modalName: "Create Customer", buttonName: "Create" , id: "", name: "", address: "", isModalOpen: false, isDeleteModalOpen:false })
    }

    openModal() {
        this.setState({ isModalOpen:true })
    }


    handleDelete(id) {
        this.setState({ isDeleteModalOpen: true,id:id })
    }

    onNameChange(value) {
        this.setState({
            name: value
        });
    }
    
    onAddressChange(value) {
        this.setState({
            address: value
        });
    }
    isFormValid=(event) =>{
        if (typeof (this.state.name) !== "undefined") {
            if (!(this.state.name).match(/^[a-zA-Z]+$/)) {
                this.setState({ nameisvalid: false, nameErrors: "Only Letters" });
            }
            else {
                this.setState({ nameisvalid: true, nameErrors: "" });
            }
        }
        if (!(this.state.address)) {
            this.setState({ addressisvalid: false, addressErrors: "Can not be empty" });
        }
        else { this.setState({ addressisvalid: true, addressErrors: "" }) };

    }


    render() {
        return (
            <div>
                <Button primary onClick={this.openModal} className="btn btn-primary" data-toggle="modal" data-target="#MyModal">New Customer</Button>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Customers.map(data =>
                            <tr key={data.id}>
                                <td>{data.name}</td>
                                <td>{data.address}</td>
                                <td>
                                    <Button className="ui small yellow button" onClick={() => this.handleEdit(data)}><i className="ui edit icon"></i> Edit</Button>
                                </td>
                                <td>
                                    <Button className="ui small red button" onClick={() => this.handleDelete(data.id)}><i className="ui trash icon"></i> Delete</Button>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
                <Modal style={inlineStyle.modal} open={this.state.isModalOpen} size="mini" className="ui modal" >
                    <Modal.Header>
                        <h2>{this.state.modalName}</h2>
                        <button type="button" className="close" aria-label="Close" onClick={this.closeModal} >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>                  
                    <Modal.Content>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <input type="hidden" name="id" id="id" value={this.state.id} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" onChange={e => this.onNameChange(e.target.value)} onKeyUp={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="name" id="name" value={this.state.name} />
                            <span style={{ color: "red" }}>{this.state.nameErrors}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" className="form-control" onKeyUp={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="address" id="address" value={this.state.address} onChange={e => this.onAddressChange(e.target.value)} />
                            <span style={{ color: "red" }}>{this.state.addressErrors}</span>
                            </div>
                        </form>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeModal} > Close</Button>
                        <Button className="ui right labeled icon button" color="green" onClick={this.handleSave} disabled={!(this.state.nameisvalid && this.state.addressisvalid)}><i className="ui right check icon"></i>{this.state.buttonName}</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size="tiny" style={inlineStyle.modal} open={this.state.isDeleteModalOpen}>
                    <Header>
                        <h4>Delete Customer</h4>
                        <button type="button" className="close" aria-label="Close" onClick={this.closeModal} >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Header>
                    <Modal.Content>
                        <p>Are you Sure?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button secondary onClick={this.closeModal} > cancel</Button>
                        <Button className="ui right labeled icon button" color="red" onClick={this.deleteRecord}><i className="ui right x icon"></i>delete</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );

    }
}