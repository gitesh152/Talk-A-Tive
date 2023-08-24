import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [toggleFetch, setToggleFetch] = useState(false);
    const [notification, setNotification] = useState([]);

    const Navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo)
            setUser(userInfo)
        else Navigate('/')
    }, [Navigate])
    return <ChatContext.Provider value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat, toggleFetch, setToggleFetch, notification, setNotification }} >{children}</ChatContext.Provider>
}

export const ChatState = () => useContext(ChatContext);

ChatProvider.propTypes = {
    children: PropTypes.node
}

export default ChatProvider;