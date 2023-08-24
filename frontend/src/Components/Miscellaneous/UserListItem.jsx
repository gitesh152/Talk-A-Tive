import PropTypes from 'prop-types'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({ user, handleFunction }) => {
    return (
        <Box onClick={handleFunction}
            cursor='pointer'
            bg='#E8E8E8'
            _hover={{
                background: '#38B2AC',
                color: 'white'
            }}
            width='100%'
            display='flex'
            alignItems='center'
            color='black'
            px='3'
            py='2'
            mb='2'
            borderRadius='lg'
        >
            <Avatar src={user.pic} name={user.name} mr='2' size='sm' cursor='pointer' />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize='xs'><b>Email : </b>{user.email}</Text>
            </Box>
        </Box>
    )
}

UserListItem.propTypes = {
    user: PropTypes.object,
    handleFunction: PropTypes.func
}

export default UserListItem
