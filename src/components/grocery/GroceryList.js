import React, { Component } from "react";
import PropTypes from "prop-types";
import "./GroceryList.css";
import Button from "../common/Button";

export class GroceryList extends Component {
    // to allow for toggle on edit of grocery, give state two properties, canEdit and editInput

    state = {
        canEdit: false,
        editInput: this.props.item.grocery,        
    }

    //this function will work in the ternaries that change edit button to submit button
    // it'll toggle the canEdit of the state
    onHandleEditClick = () => {
        this.setState((prevState) => {
            return {
                canEdit: !prevState.canEdit,
            };
        });
    };

    handleEditOnChange = (event) => {
        this.setState({
            editInput: event.target.value,
        });
    };

    onHandleEditSubmit = (id) => {
        this.onHandleEditClick();
        this.props.handleEditByID(id, this.state.editInput);
    };

    // this is so your cursor goes directly to the grocery input that user wants to edit
    componentDidUpdate() {
        let input = document.getElementById(this.props.inputID);
        if (input) {
          input.focus();
        }
    };

    
    render() {
        const { 
                grocery, 
                _id, 
                isPurchased 
            } = this.props.item;
        
        const {
                handleDeleteByID, 
                handlePurchasedByID, 
                inputID    
        } =this.props;
        
        const { 
                canEdit, 
                editInput 
            } = this.state;
        
        return (
            
            <div className="groceryList-div">

                {/* use ternarys to switch between a edit button and a submit edit button */}
                {canEdit ? (
                    <input 
                        type="text"
                        value={editInput}
                        onChange={this.handleEditOnChange}
                        name="editInput"
                        id= { inputID }
                    />
                ) : (
                    <li className={`li-style ${isPurchased && "li-style-isPurchased"}`}>{grocery}</li>
                )}

                {canEdit ? (
                   <Button
                        buttonName="Submit"
                        cssid="edit-button"
                        clickFunc={() => this.onHandleEditSubmit(_id)}
                    /> 
                ) : (
                    <Button
                        buttonName="Edit"
                        cssid="edit-button"
                        clickFunc={this.onHandleEditClick}
                    /> 
                )}
                
                
                    

                <Button 
                    buttonName="Purchased"
                    cssid="purchased-button"
                    clickFunc={() => handlePurchasedByID(_id, isPurchased)}
                />

                <Button 
                    buttonName="Delete"
                    cssid="delete-button"
                    clickFunc={() => handleDeleteByID(_id)}
                />  

                
            </div>
            
        )
    }
}

GroceryList.propTypes = {
    item: PropTypes.object.isRequired,
    handleEditByID: PropTypes.func.isRequired,
    handleDeleteByID: PropTypes.func.isRequired,
    handlePurchasedByID: PropTypes.func.isRequired,
}

export default GroceryList;