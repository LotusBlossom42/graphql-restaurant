//const graphqlHTTP  = require('express-graphql');
//var { buildSchema, assertInputType } = require('graphql');
//const express = require('express');
//const graphql = require('graphql')
import { buildSchema, assertInputType } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import express from 'express';
//import { graphql } from 'graphql';

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input dishInput{
  name: String
  price: Int
}
input restaurantInput{
  name: String!
  description: String!
  dishes: [dishInput]!
}
input updateInput{
  name: String
  description: String
  dishes: [dishInput]
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!, input: updateInput): restaurant
}
`);
// The root provides a resolver function for each API endpoint
var root = {
  restaurant: (arg) => {
    const foundres = restaurants.find(res => res.id === arg.id)
    return foundres
  },
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    console.log(input)
    restaurants.push({ id: restaurants.length + 1 , name: input.name, description: input.description, dishes: input.dishes });
    return input;
  },
  deleterestaurant: ({ id }) => {
    let restaurant = restaurants.find(i => i.id === id)
    const ok = Boolean(restaurant);
    let delc = restaurant;
    restaurants = restaurants.filter((item) => item.id !== id);
    console.log(JSON.stringify(delc));
    return { ok };
  },
  editrestaurant: ({input, id }) => {
    let foundRestaurant = restaurants.find(i => i.id === id)
    if (!foundRestaurant) {
      throw new Error("restaurant doesn't exist");
    }
    foundRestaurant = {
      ...foundRestaurant,
      ...input,
      dishes: foundRestaurant.dishes.concat(input.dishes)
    };
    let updatedRes = restaurants.map(i => i.id === id ? foundRestaurant : i)
    // console.log(restaurants[id]);
    console.log(updatedRes, "input")
    restaurants.splicei
    return updatedRes;
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

export default root;
