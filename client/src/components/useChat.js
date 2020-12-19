import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "NewChatMessage";
const SOCKET_SERVER_URL = "https://wizards-chat-room.herokuapp.com/";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody, character) => {
    console.log(socketRef.current.id);
    const d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      imgUri: character,
      time: {
        hours: hours,
        minutes: minutes
      }
    });
  };

  const initiateMessage = () => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, function(response) {
      return response;
    });
  }
  const setPrevMessages = (messageBody) => {
    setMessages(messageBody);
  };

  return { messages, sendMessage, setPrevMessages, initiateMessage };
};

export default useChat;