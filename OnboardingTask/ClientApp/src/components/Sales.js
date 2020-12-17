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


export class SalesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Sales: [],
            Customers: [],
            Products: [],
            Stores: [],
            CustomerId: "",
            ProductId: "",
            StoreId: "",
            id: "",
            DateSold:"",
            customernameisvalid: false,
            productnameisvalid: false,
            storenameisvalid: false,
            customernameErrors: "",
            productnameErrors: "",
            storenameErrors: "",
            isModalOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSave = this.handleSave.bind(this);

    }
    handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this record with sales number: " + id)) {
            return;
        }
        else {
            fetch('/api/Sales/' + id, { method: 'delete' })
            window.location.reload();        }
    }

    componentDidMount() {
        fetch('api/Customers')
            .then((response) => response.json())
            .then((data) => this.setState({ Customers: data }))

        fetch('api/Products')
            .then((response) => response.json())
            .then((data) => this.setState({ Products: data }))

        fetch('api/Stores')
            .then((response) => response.json())
            .then((data) => this.setState({ Stores: data }))

        fetch('api/Sales')
            .then((response) => response.json())
            .then((data) => this.setState({ Sales: data }))
    }

    openModal() {
        this.setState({ isModalOpen: true })
    }

    closeModal() {
        this.setState({ isModalOpen: false })
    }

    onCustomerChange = (e) => {
        this.setState({ CustomerId: e.target.value });
        console.log(e.target.value)
    }

    onProductChange = (e) => {
        this.setState({ ProductId: e.target.value });
        console.log(e.target.value)

    }

    onStoreChange = (e) => {
        this.setState({ StoreId: e.target.value });
        console.log(e.target.value)

    }

    handleEdit(data) {
        this.setState({
            id: data.id, CustomerId: data.customerId, ProductId: data.productId, StoreId: data.storeId, isModalOpen: true,DateSold:data.dateSold
        });
    }

    handleSave(event) {
        const options1 = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: parseInt(this.state.id),
                CustomerId: parseInt(this.state.CustomerId),
                ProductId: parseInt(this.state.ProductId),
                StoreId: parseInt(this.state.StoreId),
                DateSold: this.state.DateSold
            })

        }
        const options2 = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CustomerId: parseInt(this.state.CustomerId),
                ProductId: parseInt(this.state.ProductId),
                StoreId:parseInt(this.state.StoreId)
            })
        }

        if (this.state.id != 0) {
            const response1 = fetch('api/Sales/' + this.state.id, options1)
        }
        else {
            const response2 = fetch('api/Sales', options2)
        }
    }

    isFormValid() {
        if ((this.state.CustomerId) == "") {
            this.setState({ customernameisvalid: false, customernameErrors: "Select Customer name" });
        }
        else {
            this.setState({ customernameisvalid: true, customernameErrors: "" });
        }
        if ((this.state.StoreId) == "") {
            this.setState({ storenameisvalid: false, storenameErrors: "Select Store name" });
        }
        else {
            this.setState({ storenameisvalid: true, storenameErrors: "" });
        }
        if ((this.state.ProductId) == "") {
            this.setState({ productnameisvalid: false, productnameErrors: "Select Customer name" });
        }
        else {
            this.setState({ productnameisvalid: true, productnameErrors: "" });
        }
    }

    render() {
        return (
            <div>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr><div className="btn btn-primary" onClick={this.openModal}>Add New</div></tr>
                        <tr>
                            <th>Id</th>
                            <th>Customer Id</th>
                            <th>Store Id</th>
                            <th>Products Id</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Sales.map(data =>
                            <tr key={data.id} >
                                <td>{data.id}</td>
                                <td>{data.customerId}</td>
                                <td>{data.storeId}</td>
                                <td>{data.productId}</td>
                                <td>
                                    <button className="btn btn-warning" data-toggle="modal" data-target="#MyModal" onClick={() => this.handleEdit(data)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() =>this.handleDelete(data.id)}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
    
                <Modal isOpen={this.state.isModalOpen} style={customStyless} onClose={!this.state.isModalOpen} >
                    <form className="form-horizontal" onSubmit={this.handleSave} >
                        <div className="form-group">
                            <input type="hidden" value={this.state.id} name="id" id="id" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="CustomerId">Customer Name</label>
                            <select value={this.state.CustomerId} name="CustomerId" id="CustomerId" className="form-control" onClick={this.isFormValid.bind(this)} onChange={this.onCustomerChange}>
                                <option>--Select Customer here--</option>
                                {this.state.Customers.map(data =>
                                    <option key={data.id} value={data.id}> {data.name}</option>
                                )}
                            </select>
                            <span style={{ color: "red" }}>{this.state.customernameErrors}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ProductId">Product Name</label>
                            <select value={this.state.ProductId} name="ProductId" id="ProductId" className="form-control" onClick={this.isFormValid.bind(this)} onChange={this.onProductChange}>
                                <option>--Select Product here--</option>
                                {this.state.Products.map(data =>
                                    <option key={data.id} value={data.id}> {data.name}</option>
                                )}
                            </select>
                            <span style={{ color: "red" }}>{this.state.productnameErrors}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="StoreId">Store Name</label>
                            <select value={this.state.StoreId} name="StoreId" id="StoreId" className="form-control" onClick={this.isFormValid.bind(this)} onChange={this.onStoreChange}>
                                <option>--Select Store here--</option>
                                {this.state.Stores.map(data =>
                                    <option key={data.id} value={data.id}> {data.name}</option>
                                )}
                            </select>
                            <span style={{ color: "red" }}>{this.state.storenameErrors}</span>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={!(this.state.customernameisvalid && this.state.productnameisvalid && this.state.storenameisvalid)} className="btn btn-primary">Save</button>
                        </div>
                    </form>
                    <button className="btn btn-danger" onClick={this.CloseModal} data-dismiss="modal">Close</button>

                            </Modal>
                                
                        </div>
                    
        );
    }
}