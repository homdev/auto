import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle` 

::-moz-selection {
    background: #2D65F8;
    text-shadow: none;
    color: #ffffff;
}

::selection {
    background: #2D65F8;
    text-shadow: none;
    color: #ffffff;
}

/* -----------------------------------/
    01. Gamfi General CSS
-------------------------------------*/
html,
body {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    font-weight: 500; 
    background-color: #151625;
}

img {
    max-width: 100%;
    height: auto;
}

p {
    margin: 0 0 26px;
    line-height: 1.8;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: "Russo One", sans-serif;
    color: #ffffff;
    line-height: 1.35;
    font-weight: 400;
    margin: 0 0 26px;
}

h1 {
    font-size: 50px; 
}

h2 {
    font-size: 36px; 
}

h3 {
    font-size: 30px; 
}

h4 {
    font-size: 22px;
}

h5 {
    font-size: 16px;
}

h6 {
    font-size: 14px;
}

a {
    color: #fff;
    transition: all 0.3s ease;
    text-decoration: none;
    outline: none;
}

a:active,
a:hover {
    text-decoration: none;
    outline: 0 none;
    color: #a3ff12;
}

ul {
    list-style: outside none none;
    margin: 0;
    padding: 0;
}

input:focus,
select:focus,
textarea:focus,
button:focus {
    outline: none;
    text-decoration: none;
    box-shadow: none;
}

button {
    border: none;
}

/* css grid */

.grid{
    display: grid;
}
.grid-cols-7{
    grid-template-columns: repeat(7, minmax(0, 1fr));
}

.col-start-2{
    grid-column-start: 2;
}
.col-start-3{
    grid-column-start: 3;
}
.col-start-4{
    grid-column-start: 4;
}
.col-start-5{
    grid-column-start: 5;
}
.col-start-6{
    grid-column-start: 6;
}
.col-start-7{
    grid-column-start: 7;
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
}

@media only screen and (max-width: 480px) {
    body {
    font-size: 15px;
}
}




`;

export default GlobalStyles;
