import React from "react";
import { useEffect, useState } from "react";

import "./Chat.css";
import useChat from "../useChat";

const ChatRoom = (props) => {
  const { messages, sendMessage, setPrevMessages } = useChat(1);
  const [ newMessage, setNewMessage ] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setPrevMessages(props.messages);

  }, [props.messages]);

  function handleNewMessageChange(event) {
    setNewMessage(event.target.value);
  }

  const handleSendMessage = () => {
    sendMessage(newMessage, props.character);
    setNewMessage("");
  };

  return (
    <div className="container">
      <div className="chatWindow">
        <div className="send-message-button">Chat app</div>
        <ul className="chat" id="chatList">
          {messages.map((message, i) => (
            <div key={i}>
              {message.imgUri === props.character ? (
                <li className="self">
                  <div className="msg-right">
                    <img src={`/imgs/${message.imgUri}.jpg`} alt="Avatar"></img>
                    <p className="message"> {message.body}</p>
                    <span class="time-right">{message.time.hours}:{message.time.minutes}</span>
                  </div>
                </li>) : (<li className="other">
                  <div className="msg" id="msg-left">
                    <img src={`/imgs/${message.imgUri}.jpg`} alt="Avatar" className="right"></img>
                    <p className="message"> {message.body} </p>
                    <span class="time-right">{message.time.hours}:{message.time.minutes}</span>
                  </div>
                </li>
                )}
            </div>
          ))}
        </ul>
        {props.isFirst &&
          <>
            <div>
              <input className="textarea input" type="text"
                value={newMessage}
                onChange={handleNewMessageChange}
                placeholder="Write message..."
              />
              <button onClick={handleSendMessage} className="send-message-button">
                Send
              </button>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default ChatRoom;