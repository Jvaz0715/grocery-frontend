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

    render() {
        return (
            <div>


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
