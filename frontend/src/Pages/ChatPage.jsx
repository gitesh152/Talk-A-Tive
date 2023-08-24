// import { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider.jsx'
// import axios from 'axios'
import SideDrawer from '../Components/Miscellaneous/SideDrawer'
import MyChats from '../Components/Miscellaneous/MyChats'
import ChatBox from '../Components/Miscellaneous/ChatBox'
import { Box } from '@chakra-ui/react'

const ChatPage = () => {
    const { user } = ChatState();
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div >
    )
}

export default ChatPage
