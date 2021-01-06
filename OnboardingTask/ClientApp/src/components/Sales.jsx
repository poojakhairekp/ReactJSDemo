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
            DateSold: "",
            customernameisvalid: false,
            productnameisvalid: false,
            storenameisvalid: false,
            datesoldisvalid:"",
            customernameErrors: "",
            productnameErrors: "",
            storenameErrors: "",
            isModalOpen: false,
            isDeleteModalOpen:false,
            datesoldErrors: "",
            modalName: "Create Sale",
            buttonName: "Create"
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    deleteRecord() {
        $.ajax({
            url: '/api/Sales/' + this.state.id,
            type: 'DELETE',
            success: (data) => {
                window.alert("The sale record is deleted successfully!");
            },
            error: (error) => {
                window.alert("The sale records can not be deleted.")
            }
        })
        window.location.reload();
    }

    handleDelete(id) {
        this.setState({ isDeleteModalOpen:true, id:id })
 
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

        $.ajax({
            url: '/api/Stores',
            method: 'GET',
            success: (data) => {
                this.setState({ Stores: data })
            },
            error: function (error) {
                console.log(error)
            }
        })

        $.ajax({
            url: '/api/Products',
            method: 'GET',
            success: (data) => {
                this.setState({ Products: data })
            },
            error: function (error) {
                console.log(error)
            }
        })

        $.ajax({
            url: '/api/Sales',
            method: 'GET',
            success: (data) => {
                this.setState({ Sales: data })
            },
            error: function (error) {
                console.log(error)
            }
        })
    }

    openModal() {
        this.setState({ isModalOpen: true })
    }

    closeModal() {
        this.setState({ CustomerId: "", ProductId: "", StoreId: "", isModalOpen: false, isDeleteModalOpen: false, modalName: "Create Sale", buttonName:"Create" });
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

    onDateChange = (e) => {
        this.setState({ DateSold: e.target.value });
        console.log(e.target.value)

    }

    handleEdit(data) {
        console.log(data.dateSold);
        this.setState({
            modalName: "Edit Customer", buttonName:"Edit", id: data.id, CustomerId: data.customerId, ProductId: data.productId, StoreId: data.storeId, isModalOpen: true, DateSold: data.dateSold
        });
    }

    handleSave(event) {
        if (this.state.id != 0) {
            $.ajax({
                url: '/api/Sales/' + this.state.id,
                type: 'PUT',
                data: JSON.stringify({
                    id: this.state.id,
                    CustomerId: parseInt(this.state.CustomerId),
                    ProductId: parseInt(this.state.ProductId),
                    StoreId: parseInt(this.state.StoreId),
                    DateSold: this.state.DateSold
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
                url: '/api/Sales',
                type: 'POST',
                data: JSON.stringify({
                    CustomerId: parseInt(this.state.CustomerId),
                    ProductId: parseInt(this.state.ProductId),
                    StoreId: parseInt(this.state.StoreId),
                    DateSold: this.state.DateSold
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
        if ((this.state.DateSold) == "") {
            this.setState({ datesoldisvalid: false, datesoldErrors: "Select date" });
        }
        else {
            this.setState({ datesoldisvalid: true, datesoldErrors: "" });
        }
    }

    render() {
        return (
            <div>
                <Button primary onClick={this.openModal}>New Sale</Button>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Customer Id</th>
                            <th>Store Id</th>
                            <th>Products Id</th>
                            <th>Date Sold</th>
                            <th>Actions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Sales.map(data =>
                            <tr key={data.id} >
                                <td>{data.customerId}</td>
                                <td>{data.storeId}</td>
                                <td>{data.productId}</td>
                                <td>{data.dateSold}</td>
                                <td>
                                    <Button className="ui small yellow button" data-toggle="modal" data-target="#MyModal" onClick={() => this.handleEdit(data)}><i className="ui edit icon"></i> Edit</Button>
                                </td>
                                <td>
                                    <Button className="ui small red button" onClick={() => this.handleDelete(data.id)}><i className="ui trash icon"></i> Delete</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Modal open={this.state.isModalOpen} style={inlineStyle.modal} onClose={!this.state.isModalOpen} >
                    <Header>
                        <h3>{this.state.modalName}</h3>
                        <button type="button" className="close" aria-label="Close" onClick={this.closeModal} >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Header>
                    <Modal.Content>
                    <form className="form-horizontal"  >
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
                            <label htmlFor="DateSold">Date Sold</label>
                            <input type="datetime-local" value={this.state.DateSold} name="DateSold" id="DateSold" className="form-control" onBlur={this.isFormValid.bind(this)} onChange={this.onDateChange} />
                            <span style={{ color: "red" }}>{this.state.datesoldErrors}</span>
                            </div>
                        </form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeModal}>Close</Button>
                        <Button className="ui right labeled icon button" onClick={this.handleSave} color="green" type="submit" disabled={!(this.state.customernameisvalid && this.state.productnameisvalid && this.state.storenameisvalid && this.state.datesoldisvalid)}><i className="ui right check icon"></i>{this.state.buttonName}</Button>
                    </Modal.Actions>
                </Modal>

                <Modal size="mini" open={this.state.isDeleteModalOpen} style={inlineStyle.modal}>
                    <Modal.Header>
                        <h4>Delete Sale</h4>
                        <button type="button" className="close" aria-label="Close" data-dismiss="modal" onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Content>
                        <p>Are you Sure?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button secondary onClick={this.closeModal}> cancel</Button>
                        <Button color="red" className="ui right labeled icon button" onClick={this.deleteRecord}><i className="ui right x icon"></i>delete</Button>
                    </Modal.Actions>
                </Modal>
                                
            </div>
                    
        );
    }
}