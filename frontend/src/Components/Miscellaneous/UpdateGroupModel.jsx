import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    // ModalCloseButton,
    useDisclosure,
    Button,
    IconButton,
    FormControl,
    Input,
    useToast,
    Spinner,
    Box
} from '@chakra-ui/react'
import PropTypes from 'prop-types';
import axios from 'axios';
import { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import UserListItem from './UserListItem';

const UpdateGroupModel = ({ fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const { user, selectedChat, setSelectedChat, toggleFetch, setToggleFetch } = ChatState();
    const [groupChatName, setGroupChatName] = useState('')
    const [loadingRename, setLoadingRename] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const handleDelete = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: `Only Group Admin can remove users!`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: userToRemove._id
                }, config);

            setLoading(false);
            userToRemove._id === user._id ? setSelectedChat(null) : setSelectedChat(data)
            setToggleFetch(!toggleFetch)
            fetchMessages();    // fetch messages, when we remove someone from group
        } catch (error) {
            setLoading(false)
            toast({
                title: `Error removing the user`,
                description: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const handleRename = async () => {
        if (!groupChatName) {
            toast({
                title: `Please Enter New Group Name!`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return;
        }
        try {
            setLoadingRename(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`/api/chat/grouprename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName
                }, config);

            setSelectedChat(data)
            setLoadingRename(false)
            setToggleFetch(!toggleFetch)
            setGroupChatName('')
        } catch (error) {
            setLoadingRename(false)
            toast({
                title: `Error reanaming group chat`,
                description: `${error.response.data.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const handleSearch = async (query) => {
        if (!query || query === '') return setSearchResult([])
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false)
            toast({
                title: `Error searching the user`,
                description: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const handleAdd = async (userToAdd) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: `Only Group Admin can add users!`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return
        }
        if (selectedChat.users.filter((user) => user._id === userToAdd._id).length > 0) {
            toast({
                title: `User already added`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: userToAdd._id
                }, config);

            setLoading(false);
            setSearchInput('')
            setSelectedChat(data)
            setSearchResult([])
            setToggleFetch(!toggleFetch)
        } catch (error) {
            setLoading(false)
            toast({
                title: `Error adding the user`,
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
            <IconButton onClick={onOpen} display='flex' icon={<ViewIcon />} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent pos="fixed" top={{ base: '50px', md: '100px' }} zIndex={2}>
                    <ModalHeader
                        fontSize={{ base: '25px', md: '35px' }}
                        display='flex'
                        justifyContent='center'
                    >{selectedChat.chatName.toString().toUpperCase()}</ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <ModalBody>
                        {selectedChat.users?.map(u => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => { handleDelete(u) }}
                            />
                        ))}
                        <FormControl display='flex' mt='2'>
                            <Input placeholder='Chat Name' mb='3' value={groupChatName} onChange={(e) => { setGroupChatName(e.target.value) }} />
                            <Button variant='solid' colorScheme='teal' ml='1' isLoading={loadingRename} onClick={handleRename} >Rename</Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: John, Ansh, Jane'
                                mb='1'
                                value={searchInput}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading
                            ? <Box textAlign='center'> <Spinner px='auto' color='blue.500' size='xl' /></Box>
                            : (searchResult?.slice(0, 4).map(
                                (user) => (<UserListItem key={user._id} user={user} handleFunction={() => handleAdd(user)} />)
                            ))}

                    </ModalBody>
                    <ModalFooter display='flex' justifyContent='space-between'>
                        <Button colorScheme='red' onClick={() => { handleDelete(user) }}>
                            Leave Chat
                        </Button>
                        <Button onClick={onClose}>
                            Close
                        </Button>
                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

UpdateGroupModel.propTypes = {
    fetchMessages: PropTypes.func
}

export default UpdateGroupModel
