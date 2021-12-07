import React from 'react';
var ReactTestUtils = require('react-dom/test-utils'); 
import {cleanup, fireEvent, render, waitFor} from '@testing-library/react';
import TenttiSovellus from "./TenttiSovellus";
import { unmountComponentAtNode } from "react-dom";
import pretty from "pretty";

import axios from 'axios';
import { act } from 'react-dom/test-utils';
//jest.mock('axios'); 
import {within} from '@testing-library/dom'

//const TenttiSovellus = require("./TenttiSovellus");

it("Defined", () => {
    act(() => {
        render(<TenttiSovellus />)
    }),
    expect(TenttiSovellus).toBeDefined();
    
});


it("button lisää tentti", async () => {
    
    const { getByTestId } = render(<TenttiSovellus />);
    await waitFor(() => {
        //const butlt = getByTestId("butlt");
        //except(ReactTestUtils.Simulate.click(butlt)).toBeTruthy();
        expect(getByTestId("butlt")).toBeTruthy();
    })
});

it("render correctly", async ()=> {
    const { getByText } = render(<TenttiSovellus />);
    await waitFor(() => {
        expect(getByText("Lisää tentti")).toBeInTheDocument();
    })
})

it("tunti lisätty", async ()=> {
    
    
    /*const text = (() => {
        axios.get('http://localhost:3004/tentit')
                .then(function (response) {
                    console.log("noudettu data", response.data);

                })
                .catch(function (error) {
                console.log(error);
                })
                .then(function () {
                }); 
            })
            */
           
    function Tieto() {
        axios.get('http://localhost:3004/tentit').then(function (response) {
            console.log("noudettu data", response.data);
            return(response.data)
        });
    }        
    //let text = render('http://localhost:3004/tentit');    
    console.log("Data B", Tieto)    
    const { getByTestId } = render(<TenttiSovellus />);
    await waitFor(() => {
        let a = Tieto.length
        console.log(a)
        ReactTestUtils.Simulate.click(getByTestId("butlt"));
        expect(Tieto).toHaveLength(a+1);
    })
})
/*
let container = null;
beforeEach(() => {
  
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
 
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<TenttiSovellus />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); 

})
*/