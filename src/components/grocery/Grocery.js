import React, { Component } from "react";
import axios from "axios";
import "./Grocery.css";
import GroceryList from "./GroceryList";
import Button from "../common/Button";


const URL = "http://localhost:3001";

export class Grocery extends Component {

    state = {
        groceryList: [],
        groceryInput: "",
        error: null,
        errorMessage: "",
    };

    // this will load what is in the database as soon as you mount or open the browser
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

    };

    handleEditByID = async (id, editInput) => {
        try {
            let editedGrocery = await axios.put(
                `${URL}/api/grocery-list/update-grocery-by-id/${id}`,
                {
                    grocery: editInput,
                }
            );

            let updatedGroceryArray = this.state.groceryList.map((item) => {
                if (item._id === id) {
                    item.grocery = editedGrocery.data.payload.grocery;
                }
                return item;
            });

            this.setState({
                groceryList: updatedGroceryArray,
            });
        } catch (e) {
            console.log(e);
        }
    };

    handlePurchasedByID = async (id, isPurchased) => {
        try {
            let groceryIsPurchasedUpdated = await axios.put(
                `${URL}/api/grocery-list/update-grocery-by-id/${id}`,
                {
                    isPurchased: !isPurchased,
                }
            );
            
           let updatedGroceryArray = this.state.groceryList.map((item) => {
               if (item._id === groceryIsPurchasedUpdated.data.payload._id) {
                   item.isPurchased = groceryIsPurchasedUpdated.data.payload.isPurchased;
               }
               return item;
            });

            this.setState({
                groceryList: updatedGroceryArray,
            });
            
        } catch(e) {
            console.log(e);
        }
    };

    handleDeleteByID = async (id) => {
        try {
            let deletedGrocery = await axios.delete(
                `${URL}/api/grocery-list/delete-grocery-by-id/${id}`
            );

            let filteredGroceryArray = this.state.groceryList.filter(
                (item) => item._id !== deletedGrocery.data.payload._id
            );

            this.setState({
                groceryList: filteredGroceryArray,
            })
                

        } catch (e) {
            console.log(e);
        }
    };

    sortByPurchased = async(isPurchased) => {
        try{
            let isPurchasedGroceryArray = await axios.get(
                `${URL}/api/grocery-list/get-groceries-by-purchased?isPurchased=${isPurchased}`
            );

            this.setState({
                groceryList: isPurchasedGroceryArray.data.payload,
            });

        } catch(e) {
            console.log(e);
        }
    };

    sortByDate = async(sortOrder) => {
        try {
            let sortedGroceries = await axios.get(
                `${URL}/api/grocery-list/get-groceries-by-sort?sort=${sortOrder}`
            );

            this.setState({
                groceryList: sortedGroceries.data.payload,
            });
        } catch (e) {
            console.log(e);
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

                {/* sorting-div */}
                <div className="sorting-div">
                    <ul>
                        <li>
                            <Button 
                                buttonName=" Sort by date added- Oldest to Newest"
                                cssid=""
                                clickFunc={() => this.sortByDate("asc")}
                            />
                        </li>

                        <li>
                            <Button 
                                buttonName="Sort by date added- Newest to Oldest"
                                cssid=""
                                clickFunc={() => this.sortByDate("desc")}
                            />
                        </li>

                        <li>
                            <Button 
                                buttonName="Sort by Purchased"
                                cssid=""
                                clickFunc={() => this.sortByPurchased("true")}
                            />
                        </li>

                        <li>
                            <Button 
                                buttonName="Sort by Not Purchased"
                                cssid=""
                                clickFunc={() => this.sortByPurchased("false")}
                            />
                        </li>
                    </ul>
                </div>

                {/* grocery-div */}
                <div className="grocery-div">
                    <ul>
                        {this.state.groceryList.map((item, index) => {
                            return(
                                <GroceryList
                                key={item._id}
                                item={item}
                                handleEditByID={this.handleEditByID}
                                handlePurchasedByID={this.handlePurchasedByID}
                                handleDeleteByID={this.handleDeleteByID}
                                inputID={item._id }
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
