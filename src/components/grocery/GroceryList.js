import React, { Component } from "react";
import PropTypes from "prop-types";
import "./GroceryList.css";
import Button from "../common/Button";

export class GroceryList extends Component {
   
    state = {
            
    }
    
    render() {
        const { grocery } = this.props.item;
        
        return (
            
            <div className="groceryList-div">
                <li className="li-style">{grocery}</li>
                <table style={{display: "flex"}}>
                    <Button
                        buttonName="Edit"
                        cssid="edit-button"
                        // clickFunc={}
                    />

                    <Button 
                        buttonName="Purchased"
                        cssid="purchased-button"
                        //clickFunc={}
                    />

                    <Button 
                        buttonName="Delete"
                        cssid="delete-button"
                        //clickFunc={}
                    />  
                </table>
                
            </div>
            
        )
    }
}

GroceryList.propTypes = {
    item: PropTypes.object.isRequired,
}

export default GroceryList;