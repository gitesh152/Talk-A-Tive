import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react"
import { ChatState } from "../../Context/ChatProvider"
import { ArrowBackIcon } from '@chakra-ui/icons'
import ProfileModel from './ProfileModel'
import UpdateGroupModel from "./UpdateGroupModel"
import { useEffect, useState } from "react"
import axios from "axios"
import './styles.css'
import ScrollableChat from "./ScrollableChat"
import io from 'socket.io-client'
import LottieComponent from "./Lottie"
import { getFullSender, getSender } from "../../config/ChatLogics"

// const ENDPOINT = 'http://localhost:5000'; 
const ENDPOINT = 'https://talk-a-tive-qnvn.onrender.com';

var socket, selectChatCompare;

const SingleChat = () => {
    const { user, selectedChat, setSelectedChat, toggleFetch, setToggleFetch, notification, setNotification } = ChatState()
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnection, setSocketConnection] = useState(false)
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const toast = useToast();


    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false)
            socket.emit('join room', selectedChat._id)
        }
        catch (error) {
            setLoading(false)
            toast({
                title: `Error fetching chat messages`,
                description: `${error.response.data.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    useEffect(() => {
        fetchMessages();
        selectChatCompare = selectedChat
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);

    useEffect(() => {
        socket = io(ENDPOINT.trim());
        // if above dont work
        // socket = io(ENDPOINT',{transports:['polling']});
        socket.emit('setup', user)  //emit setup first 
        socket.on('connected', () => setSocketConnection(true)) //then receive connected
        socket.on('typing', () => setIsTyping(true))
        socket.on('stopTyping', () => setIsTyping(false))
    }, [user])

    useEffect(() => {
        socket.on('message received', (newMessageRecieved) => {
            //if no chat is selected or selectedchat.id!==newMessageChat.id
            if (!selectChatCompare || selectChatCompare._id !== newMessageRecieved.chat._id) {
                //give notification
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setToggleFetch(!toggleFetch);
                }
            }
            //if chat is selected && that chat is newMessage.chat
            else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })
    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnection) return

        if (!typing) {  //if not typing
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();
        var timeLength = 3000

        //throttle fn
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timeLength && typing) {
                socket.emit('stopTyping', selectedChat._id)
                setTyping(false)
            }
        }, timeLength)
    }

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            socket.emit('stopTyping', selectedChat._id)

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
                setNewMessage('')
                const { data } = await axios.post(`/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat._id
                    }, config);
                setMessages([...messages, data])
                socket.emit('new message', data)
            }
            catch (error) {
                toast({
                    title: `Error sending message`,
                    description: `${error.response.data.message}`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                })
            }
        }
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontFamily='poppins'
                        fontSize='2xl'
                        display='flex'
                        justifyContent={'space-between'}
                        w='100%'
                        pb='3'
                        px='2'
                    > <IconButton display={{ base: 'flex', md: 'none' }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat(null)} />
                        {!selectedChat.isGroupChat
                            ?
                            (<>
                                {getSender(user, selectedChat.users)}
                                <ProfileModel user={getFullSender(user, selectedChat.users)} />
                            </>)
                            :
                            (<>{selectedChat.chatName.toUpperCase()}
                                < UpdateGroupModel fetchMessages={fetchMessages} />
                            </>)
                        }
                    </Text>
                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p='3'
                        bg='#E8E8E8'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading
                            ? <Spinner m='auto' alignSelf='center' size='xl' h='20' w='20' />
                            : (<div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>)
                        }
                        <FormControl
                            mt='1'
                            onKeyDown={sendMessage}
                        >
                            {isTyping ?
                                <LottieComponent />
                                : ''}
                            <Input
                                variant='filled'
                                bg='#E0E0E0'
                                value={newMessage}
                                placeholder='Enter a message.'
                                onChange={handleTyping}
                            />
                        </FormControl>
                    </Box>
                </>
            ) :
                (
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        width='100%'
                        h='100%'
                    >
                        <Text fontSize='3xl' fontFamily='poppins'>
                            Click on user or group to start chatting.
                        </Text>
                    </Box>
                )}
        </>
    )
}

export default SingleChat
