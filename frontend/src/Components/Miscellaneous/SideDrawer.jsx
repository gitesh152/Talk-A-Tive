import { useState } from "react"
import {
    Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer,
    DrawerBody,
    // DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton, Input, useDisclosure, useToast, Spinner, Badge
} from "@chakra-ui/react";
import { ChevronDownIcon, BellIcon, Search2Icon } from '@chakra-ui/icons'
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, chats, setChats, setSelectedChat, notification, setNotification } = ChatState();
    const Navigate = useNavigate()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        Navigate('/')
    }
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: `Please enter something to search`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false)
            toast({
                title: `Error fetching the user`,
                description: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            }
            const { data } = await axios.post('/api/chat', { userId }, config);
            if (!chats.find(c => c._id === data._id)) setChats([data, ...chats])
            setLoadingChat(false)
            setSelectedChat(data);
            onClose();
        } catch (error) {
            setLoadingChat(false)
            toast({
                title: `Error fetching the chat`,
                description: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    return (
        <>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                width='100%'
                padding='5px 10px 5px 10px'
                borderWidth='5px'
                borderColor='blackAlpha.50'
            >
                <Tooltip label='Search Users to chat' hasArrow placement="bottom">
                    <Button variant='ghost' onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text p='4' display={{ base: 'none', md: 'flex' }}>Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontFamily='poppins' fontSize={{ base: 'lg', md: '2xl' }}>
                    Talk-A-Tive
                </Text>

                <Box>
                    <Menu>
                        <MenuButton p='1' mx='2' style={{ position: 'relative' }} >
                            <BellIcon fontSize='2xl' />
                            {notification.length > 0
                                &&
                                <Badge style={{ position: 'absolute', left: '18px', top: '0', backgroundColor: '#d4130d', color: 'white', width: '20px' }} borderRadius='25' >
                                    {notification.length > 9 ? '9+' : notification.length}
                                </Badge>}
                        </MenuButton>
                        <MenuList textAlign='center'>
                            {!notification.length && "No New Messages!"}
                            {notification.map((n) => (
                                <MenuItem key={n._id} onClick={() => {
                                    setSelectedChat(n.chat)
                                    setNotification(notification.filter(noti => noti !== n))
                                }} >
                                    {n.chat.isGroupChat ? `New Messages in ${n.chat.chatName}` : `New Messages from ${getSender(user, n.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}  >
                            <Avatar size='sm' cursor='pointer' src={user.pic} name={user.name} />
                        </MenuButton>
                        <MenuList border='none'>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box >
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb='2' >
                            <Input placeholder='Search By Name or Email ...' value={search}
                                onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch} ms='3' isLoading={loading}><Search2Icon fontSize='2xl' /></Button>
                        </Box>

                        {loading ? (<ChatLoading />) : (

                            searchResult?.map((user => (<UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />)))
                        )}
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
