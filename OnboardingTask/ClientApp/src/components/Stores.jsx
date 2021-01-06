import React, { Component } from 'react';
import { Popup, Button, Modal, Header } from 'semantic-ui-react';
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

export class StoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Stores: [],
            name: "",
            address: "",
            id: "",
            nameErrors: "",
            addressErrors: "",
            nameisvalid: false,
            addressisvalid: false,
            isModalOpen: false,
            isDeleteModalOpen: false,
            modalName: "Create Store",
            buttonName: "Create"
        };
        this.handleSave = this.handleSave.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    deleteRecord() {
        $.ajax({
            url: '/api/Stores/' + this.state.id,
            type: 'DELETE',
            success: (data) => {
                window.alert("The store record is deleted successfully!");
            },
            error: (error) => {
                window.alert("The store records can not be deleted. It must appear in Sale records.")
            }
        })
        
        window.location.reload();
    }

    componentDidMount() {
        $.ajax({
            url: '/api/Stores',
            method: 'GET',
            success: (data)=> {
                console.log("data" + data)
                this.setState({ Stores: data })
            },
            error: function (error) {
                console.log(error)
            }
        })
        
    }


    handleEdit(data) {
        this.setState({ modalName: "Edit Store", buttonName:"Edit", id: data.id, name: data.name, address: data.address, isModalOpen: true });
    }

    handleSave(event) {
        if (this.state.id != 0) {
            $.ajax({
                url: '/api/Stores/' + this.state.id,
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
                url: '/api/Stores',
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
        this.setState({ modalName: "Create Store", buttonName: "Create" , id: "", name: "", address: "", isModalOpen: false, isDeleteModalOpen:false })
    }

    openModal() {
        this.setState({ isModalOpen: true })
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
    isFormValid(event) {
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
                <Button primary onClick={this.openModal} className="btn btn-primary" data-toggle="modal" data-target="#MyModal">New Store</Button>
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
                        {this.state.Stores.map(data =>
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
                <Modal open={this.state.isModalOpen} style={inlineStyle.modal} onClose={!this.state.isModalOpen} >
                    <Modal.Header>
                        <h4>{this.state.modalName}</h4>
                    <button type="button" className="close" aria-label="Close" onClick={this.closeModal} >
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Content>
                    <form className="form-horizontal" >
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
                        <Button color="green" onClick={this.handleSave} disabled={!(this.state.nameisvalid && this.state.addressisvalid)} className="ui right labeled icon button"><i className="ui right check icon"></i>{this.state.buttonName} </Button>
                    </Modal.Actions>
                </Modal>
                <Modal size="tiny" open={this.state.isDeleteModalOpen} style={inlineStyle.modal} onClose={!this.state.isDeleteModalOpen} >
                    <Modal.Header>
                        <h4>Delete Store</h4>
                        <button type="button" className="close" aria-label="Close" onClick={this.closeModal} >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
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