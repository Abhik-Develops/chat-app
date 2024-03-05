import { createContext, useContext, useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { matchPath } from "react-router";

const ChatContext = createContext()

const ChatProvider = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo){
            if(location.pathname === '/sendpasswordresetemail' || matchPath('/reset-password/:id/:token', location.pathname) || matchPath('/verify-email/:id/:token', location.pathname)){
                return;
            }
            navigate('/');
        } 
    },[navigate]);
    return (
        <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications}}>{children}</ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;