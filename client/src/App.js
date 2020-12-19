import React from "react";
import { useEffect, useState } from "react";

import "./index.css";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import Navbar from "./components/Navbar";

function App() {
  const [chatState, setChatState] = useState({
    showChat : false,
    isFirst : false,
    istruelyfirst : false,
    chatHistory : [],
    character : null,
    characterList : []
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    document.title = 'Wizarding world';
    const response = await fetch(`https://wizards-chat-room.herokuapp.com/api/initiate-chat`);
    let chatDetails = await response.json();

    setChatState(prevState => ({
      ...prevState,
      isFirst : chatDetails.message,
      chatHistory : chatDetails.chat,
      characterList : chatDetails.characterList
    }));
  }, []);

  const handleChange = (character) => {
    setChatState(prevState => ({
      ...prevState,
      isFirst : false,
      showChat : true,
      istruelyfirst : true,
      character : character
    }));

  }
  
  return (<>
    <Navbar></Navbar>
    {!chatState.showChat && chatState.isFirst && <Home characterList = {chatState.characterList} onChange={handleChange}></Home>}
    {!chatState.isFirst && <Chat isFirst={chatState.istruelyfirst} messages={chatState.chatHistory} character={chatState.character}></Chat>}
  </>
  );
}

export default App; 