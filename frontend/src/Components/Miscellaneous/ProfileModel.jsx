// import  from 'react'
import { ViewIcon } from '@chakra-ui/icons'
import {
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    // ModalCloseButton,
    Button,
    Image,
    Text
} from '@chakra-ui/react'
import Proptypes from 'prop-types'


const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {
                children
                    ?
                    <span onClick={onOpen}>{children}</span>
                    :
                    <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
            }
            <Modal isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader
                        display='flex'
                        justifyContent='center'
                        fontSize='40px'
                        fontFamily='poppins'
                    >{user.name}</ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <ModalBody display='flex' flexDir='column' alignItems='center' justifyContent='space-between'>
                        <Image borderRadius='full' boxSize='150px' src={user.pic} alt={user.name} />
                        <Text fontSize={{ base: '25px', md: '30px' }}>{user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

ProfileModel.propTypes = {
    children: Proptypes.node,
    user: Proptypes.object,
}

export default ProfileModel
