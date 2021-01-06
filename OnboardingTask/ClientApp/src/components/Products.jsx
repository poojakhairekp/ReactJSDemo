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
            isModalOpen: false,
            isDeleteModalOpen: false,
            modalName: "Create Product",
            buttonName: "Create"
        };
        this.handleSave = this.handleSave.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    deleteRecord() {
        $.ajax({
            url: '/api/Products/' + this.state.id,
            type: 'DELETE',
            success: (data) => {
                alert("The product record is deleted successfully!");
            },
            error: (error)=> {
                alert("The product records can not be deleted. It must appear in Sale records.")
            }
        })
        window.location.reload();
    }


    componentDidMount() {
        $.ajax({
            url: '/api/Products',
            type: 'GET',
            success: (data) => {
                console.log("data" + data)
                this.setState({ Products: data })
            },
            error: function (error) {
                console.log(error)
            }
        })
    }


    handleEdit(data) {
        this.setState({ modalName: "Edit Product", buttonName:"Edit", id: data.id, name: data.name, price: data.price, isModalOpen: true });
    }

    handleSave(event) {
        if (this.state.id != 0) {
            $.ajax({
                url: '/api/Products/' + this.state.id,
                type: 'PUT',
                data: JSON.stringify({
                    id: this.state.id,
                    name: this.state.name,
                    price: parseFloat(this.state.price)
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
                url: '/api/Products',
                type: 'POST',
                data: JSON.stringify({
                    name: this.state.name,
                    price: parseFloat(this.state.price)
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
        this.setState({ modalName: "Create Product", buttonName: "Create" , id: "", name: "", price: "", isModalOpen: false, isDeleteModalOpen: false })
    }

    openModal() {
        this.setState({ isModalOpen: true })
    }


    handleDelete(id) {
        this.setState({ isDeleteModalOpen: true , id:id})
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
                <Button onClick={this.openModal} primary data-toggle="modal" data-target="#MyModal">New Product</Button>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Products.map(data =>
                            <tr key={data.id} >
                                <td>{data.name}</td>
                                <td>{data.price}</td>
                                <td>
                                    <Button className="ui small button" color="yellow" onClick={() => this.handleEdit(data)}><i className="ui edit icon"></i>EDIT</Button>
                                </td>
                                <td>
                                    <Button className="ui small button" color="red" onClick={() => this.handleDelete(data.id)}><i className="ui trash icon"></i>DELETE</Button>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
                <Modal open={this.state.isModalOpen} style={inlineStyle.modal} onClose={!this.state.isModalOpen} >
                    <Modal.Header>
                        <h2>{this.state.modalName} </h2>
                        <button type="button" className="close" aria-label="Close" data-dismiss="modal" onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Content>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <input type="hidden" name="id" id="id" value={this.state.id} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Name">Name</label>
                                <input type="text" className="form-control" onChange={e => this.onNameChange(e.target.value)} onKeyUp={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="name" id="name" value={this.state.name} />
                                <span style={{ color: "red" }}>{this.state.NameErrors}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Price">Price</label>
                                <input type="text" className="form-control" onKeyUp={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="price" id="price" value={this.state.price} onChange={e => this.onPriceChange(e.target.value)} />
                                <span style={{ color: "red" }}>{this.state.PriceErrors}</span>
                            </div>
                        </form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeModal} data-dismiss="modal">Close</Button>
                        <Button className="ui right labeled icon button" onClick={this.handleSave} color="green" disabled={!(this.state.nameisvalid && this.state.priceisvalid)}><i className="ui right check icon"></i>{this.state.buttonName}</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size="mini" open={this.state.isDeleteModalOpen} style={inlineStyle.modal}>
                    <Modal.Header>
                        <h4>Delete Product</h4>
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