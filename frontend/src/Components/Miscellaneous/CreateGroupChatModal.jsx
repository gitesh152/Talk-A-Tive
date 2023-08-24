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
    useToast,
    FormControl,
    Input,
    Spinner,
    Box
} from '@chakra-ui/react'
import { useState } from 'react';
import Proptypes from 'prop-types'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const [groupChatName, setGroupChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, chats, setChats } = ChatState();

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
                title: `Error fetching the users`,
                description: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: `User already added`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
        setSearchResult([])
    }

    const handleDelete = (userToRemove) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToRemove._id))
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: `Please fill all the fields`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post(`/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map(user => user._id))
                }, config);
            setChats([data, ...chats])
            setSelectedUsers([])
            setGroupChatName('')
            setLoading(false)
            onClose();
        } catch (error) {
            setLoading(false)
            toast({
                title: `Error creating group chat`,
                description: `${error.response.data.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent pos="fixed" top={{ base: '50px', md: '100px' }} zIndex={2}>
                    <ModalHeader display='flex' justifyContent='center' fontSize='35px' fontFamily='poppins'>Create Group Chat</ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <ModalBody display='flex' flexDir='column' alignItems='center'>
                        <FormControl>
                            <Input
                                placeholder='Enter Chat Name'
                                mb='3'
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}

                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: John, Ansh, Jane'
                                mb='1'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box display='flex' w='100%' flexWrap='wrap' verticalAlign='baseline'>
                            {selectedUsers?.map(user => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => { handleDelete(user) }}
                                />
                            ))}
                        </Box>
                        {loading
                            ? <Spinner color='blue.500' size='xl' />
                            : (searchResult?.slice(0, 4).map(
                                (user) => (<UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />)
                            ))}

                    </ModalBody>
                    <ModalFooter display='flex' justifyContent='space-between'>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}

GroupChatModal.propTypes = {
    children: Proptypes.node
}

export default GroupChatModal
