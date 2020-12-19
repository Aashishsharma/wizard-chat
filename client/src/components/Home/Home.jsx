import React from "react";
import "./Home.css";

const Home = (props) => {

  function handleChange(e) {
    props.onChange(e.target.id);
  }

  return (
    <div className="container">
      <div class="title">Choose your Wizard </div>
      {props.characterList.map((character, i) => (
      <button id = {character} onClick = {handleChange} className="enter-room-button">{character}<img src = {`/imgs/${character}.jpg`}></img></button>
      ))}
    </div>
  );
};

export default Home;