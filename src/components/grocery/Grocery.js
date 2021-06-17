import React, { Component } from "react";
import axios from "axios";
import "./Grocery.css";
import GroceryList from "./GroceryList";


const URL = "http://localhost:3001";

export class Grocery extends Component {

    state = {
        groceryList: [],
        groceryInput: "",
        error: null,
        errorMessage: "",
    };

    async componentDidMount() {
        try {
            let allGroceries = await axios.get(
                `${URL}/api/grocery-list/get-all-groceries`
            );

                
            this.setState({
                groceryList: allGroceries.data.payload,
            })

        } catch (e) {
            console.log(e);
        }
    };

    handleTodoOnChange = (event) => {
        this.setState({
            groceryInput: event.target.value,
            error: null,
            errorrMessage: "",
        });
    };

    handleOnSubmit = async (event) => {
        event.preventDefault();

        // check if there is anything in the input field, do not let the grocery div update with an empty grocery input

        if(this.state.groceryInput.length === 0) {
            this.setState({
                error: true,
                errorMessage: "Cannot create an empty grocery item",
            });
        }
        // next, check to make sure this grocery item does not already exist in the grocery-div
        else {
            let groceryExists = this.state.groceryList.findIndex((item) => 
                item.grocery.toLowerCase() === this.state.groceryInput.toLowerCase()
            );

            if (groceryExists > -1) {
                this.setState({
                    error: true,
                    errorMessage: "That grocery item is already listed",
                });
            } else {
                try {
                    let createdGrocery = await axios.post(
                        `${URL}/api/grocery-list/create-grocery`,
                        {
                            grocery: this.state.groceryInput,
                        }
                    );
                    
                    // now you need a new array that will take the set state grocery list and add the createdGrocery, this new array will be what you set the state to
                    // the elipse will extend the groceryList of this.state
                    let newGroceryArray = [...this.state.groceryList, createdGrocery.data.payload];

                    this.setState({
                        groceryList: newGroceryArray,
                        // this will reset the input to blank rather than keep prior submit present
                        groceryInput: "",
                    })

                } catch (e) {
                    console.log(e);
                }
            }
        }

    }
 
    render() {
        return (
            <div>

                {/* form-div */}
                <div className="form-div">
                    <form onSubmit={this.handleOnSubmit}>
                        <input
                            // note that name and id are similar but inverse 
                            name="groceryInput" 
                            text="text"
                            onChange={this.handleTodoOnChange}
                            value={ this.state.groceryInput }
                            autoFocus
                            id="inputGrocery" 
                        />
                        <button type="submit">Submit</button>
                        <br />
                        {/* the below will only appear if an error is triggered in handleOnSubmit */}
                        <span style={{ color : "red" }}>{this.state.error && this.state.errorMessage}</span>
                    </form>
                </div>

                {/* grocery-div */}
                <div className="grocery-div">
                    <ul>
                        {this.state.groceryList.map((item, index) => {
                            return(
                                <GroceryList
                                key={item._id}
                                item={item} 
                                />
                            );
                        })}
                    </ul>
                </div>



            </div>
        )
    }

}

export default Grocery;
