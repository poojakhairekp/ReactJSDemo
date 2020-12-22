import React, { Component } from 'react';
import Modal from 'react-modal';

const customStyless = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        height: '400px',
        width:'450px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
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
            isModalOpen: false
        };
        this.handleSave = this.handleSave.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentDidMount() {
        fetch('/api/Customers')
            .then((response) => response.json())
            .then((data) => this.setState({ Customers: data }))

    }


    handleEdit(data) {
        this.setState({ id: data.id, name: data.name, address: data.address, isModalOpen: true });
    }

    handleSave(event) {
        const options1 = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.name,
                address: this.state.address
            })

        }

        const options2 = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                address: this.state.address
            })

        }
        
        if (this.state.id != 0) {
            const response1 = fetch('api/Customers/' + this.state.id, options1)
        }
        else {
            const response2 = fetch('api/Customers', options2)
        }
    }

    closeModal() {
        this.setState({ id: "", name: "", address:"", isModalOpen: false })
    }

    openModal() {
        this.setState({ isModalOpen:true })
    }


    handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this record with customer number: " + id)) {
            return;
        }
        else {
            fetch('/api/Customers/' + id, { method: 'delete' })
            window.location.reload();
        }
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
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr><div onClick={this.openModal} className="btn btn-primary" data-toggle="modal" data-target="#MyModal">Add New</div></tr>
                        <tr>
                            <th>Customer Id</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Customers.map(data =>
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.address}</td>
                                <td>

                                    <div className="btn btn-warning" onClick={() => this.handleEdit(data)}>Edit</div>
                                    <div className="btn btn-danger" onClick={() => this.handleDelete(data.id)}>Delete</div>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
                <Modal isOpen={this.state.isModalOpen} style={customStyless} onClose={!this.state.isModalOpen} >
                    <h2>SaveModal</h2>
                    <button type="button" className="close" aria-label="Close" onClick={this.closeModal} >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <form className="form-horizontal" onSubmit={this.handleSave} >
                        <div className="form-group">
                            <input type="hidden" name="id" id="id" value={this.state.id} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" onChange={e => this.onNameChange(e.target.value)} onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="name" id="name" value={this.state.name} />
                            <span style={{ color: "red" }}>{this.state.nameErrors}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" className="form-control" onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="address" id="address" value={this.state.address} onChange={e => this.onAddressChange(e.target.value)} />
                            <span style={{ color: "red" }}>{this.state.addressErrors}</span>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={!(this.state.nameisvalid && this.state.addressisvalid)} className="btn btn-primary">Save</button>
                        </div>
                    </form>
                    <button className="btn btn-danger" onClick={this.closeModal} > Close</button>

                </Modal>

            </div>
        );

    }
}