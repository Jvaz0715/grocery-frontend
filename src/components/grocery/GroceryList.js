import React, { Component } from "react";
import PropTypes from "prop-types";
import "./GroceryList.css";

export class GroceryList extends Component {
   
    state = {
            
    }
    
    render() {
        const { grocery } = this.props.item;
        return (
            <div className="groceryList-div">
                <li className="li-style">{grocery}</li>
            </div>
            
        )
    }
}

GroceryList.propTypes = {
    item: PropTypes.object.isRequired,
}

export default GroceryList;