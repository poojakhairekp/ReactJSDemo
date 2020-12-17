import React, { Component } from 'react';
import Modal from 'react-modal';

const customStyless = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        height: '400px',
        width: '450px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Products: [],
            name: "",
            price: "",
            id: "",
            NameErrors: "",
            PriceErrors: "",
            nameisvalid: false,
            priceisvalid: false,
            isModalOpen:false
        };
        this.handleSave = this.handleSave.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentDidMount() {
        fetch('/api/Products')
            .then((response) => response.json())
            .then((data) => this.setState({ Products: data }))

    }


    handleEdit(data) {
        this.setState({ id: data.id, name: data.name, price: data.price, isModalOpen: true });
    }

    handleSave(event) {
        const options1 = {
            method: 'put',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.name,
                price: parseFloat(this.state.price)
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
                price: parseFloat(this.state.price)
            })

        }

        if (this.state.id != 0) {
            const response1 = fetch('api/Products/' + this.state.id, options1)
        }
        else {
            const response2 = fetch('api/Products', options2)
        }
    }



    closeModal() {
        this.setState({ isModalOpen: false })
    }

    openModal() {
        this.setState({ isModalOpen: true })
    }


    handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this record with product number: " + id)) {
            return;
        }
        else {
            fetch('/api/Products/' + id, { method: 'delete' })
            window.location.reload();
        }
    }

    onNameChange(value) {
        this.setState({
            name: value
        });
    }

    onPriceChange(value) {
        this.setState({
            price: value
        });
    }
    isFormValid(event) {
        if (typeof (this.state.name) !== "undefined") {
            if (!(this.state.name).match(/^[a-zA-Z]+$/)) {
                this.setState({ nameisvalid: false, NameErrors: "Only Letters" });
            }
            else {
                this.setState({ nameisvalid: true, NameErrors: "" });
            }
        }
        if (!(this.state.price)) {
            this.setState({ priceisvalid: false, PriceErrors: "Can not be empty" });
        }
        else { this.setState({ priceisvalid: true, PriceErrors: "" }) };

        if (typeof (this.state.price) !== "undefined") {
            if (!(this.state.price).toString().match(/^[0-9]+$/)) {
                this.setState({ priceisvalid: false, PriceErrors: "Only Numbers" });
            }
            else {
                this.setState({ priceisvalid: true, PriceErrors: "" });
            }
        }
    }


    render() {
        return (
            <div>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr><div onClick={this.openModal} className="btn btn-primary" data-toggle="modal" data-target="#MyModal">Add New</div></tr>
                        <tr>
                            <th>Product Id</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Products.map(data =>
                            <tr key={data.id} >
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.price}</td>
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
                    <button type="button" className="close" aria-label="Close" data-dismiss="modal" onClick={this.closeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <form className="form-horizontal" onSubmit={this.handleSave} >
                                    <div className="form-group">
                                        <input type="hidden" name="id" id="id" value={this.state.id} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Name">Name</label>
                                        <input type="text" className="form-control" onChange={e => this.onNameChange(e.target.value)} onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="name" id="name" value={this.state.name} />
                                        <span style={{ color: "red" }}>{this.state.NameErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Price">Price</label>
                                        <input type="text" className="form-control" onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="price" id="price" value={this.state.price} onChange={e => this.onPriceChange(e.target.value)} />
                                        <span style={{ color: "red" }}>{this.state.PriceErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" disabled={!(this.state.nameisvalid && this.state.priceisvalid)} className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                             <button className="btn btn-danger" onClick={this.closeModal} data-dismiss="modal">Close</button>
                </Modal>
                </div>
        );

    }
}