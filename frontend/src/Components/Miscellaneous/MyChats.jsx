import { ChatState } from "../../Context/ChatProvider";
import { useEffect } from "react";
import {
    Box,
    Button,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import axios from 'axios';
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import GroupChatModal from './CreateGroupChatModal'
import { getSender } from "../../config/ChatLogics";

const MyChats = () => {
    const { user, chats, setChats, selectedChat, setSelectedChat, toggleFetch } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            }
            const { data } = await axios.get('/api/chat', config);
            setChats(data)
        } catch (error) {
            toast({
                title: `Error fetching user chats`,
                description: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    useEffect(() => {
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleFetch])
    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: 'flex' }}
            flexDir={'column'}
            alignItems={'center'}
            p={3}
            bg={'white'}
            w={{ base: "100%", md: "31%" }}
            borderRadius={"lg"}
            borderWidth='5px'
            borderColor='blackAlpha.50'
        >
            <Box pb={3} px={3} fontSize={{ base: "15px", md: "15px", lg: '20px' }}
                fontFamily='poppins'
                display={'flex'}
                w={"100%"}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display={'flex'}
                        fontSize={{ base: '12px', lg: '15px' }}
                        rightIcon={<AddIcon />}
                    >New Group Chat</Button>
                </GroupChatModal>
            </Box>
            <Box
                display={'flex'}
                flexDir={'column'}
                p={3}
                bg={'#F8F8F8'}
                w={"100%"}
                h={"100%"}
                borderRadius="lg"
                overflowY="hidden">
                {chats ? (

                    <Stack overflowY='auto' >
                        {chats.map((chat) => (<Box
                            key={chat._id}
                            onClick={() => setSelectedChat(chat)}
                            color={chat === selectedChat ? "white" : "black"}
                            bg={chat === selectedChat ? "#38B2AC" : "#E8E8E8"}
                            px='3'
                            py='2'
                            borderRadius='lg'
                        >
                            <Text>
                                {!chat.isGroupChat
                                    ? getSender(user, chat.users)
                                    : chat.chatName}
                            </Text>
                            {chat.latestMessage && (
                                <Text fontSize="xs">
                                    <b>{chat.latestMessage.sender.name} : </b>
                                    {chat.latestMessage.content.length > 50
                                        ? chat.latestMessage.content.substring(0, 51) + "..."
                                        : chat.latestMessage.content}
                                </Text>
                            )}

                        </Box>))}
                    </Stack>

                ) : <ChatLoading />}
            </Box>
        </Box>
    )
}

export default MyChats
