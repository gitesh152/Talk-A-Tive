import { Badge } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons'
import PropTypes from 'prop-types';
import { ChatState } from '../../Context/ChatProvider';

const UserBadgeItem = ({ user, handleFunction }) => {
    const { user: loggedUser } = ChatState();
    return (
        <Badge onClick={user._id === loggedUser._id ? null : handleFunction} variant='solid' colorScheme='purple' py='1' m='1' px='2' borderRadius='md' cursor='pointer'>
            {user.name}  {user._id === loggedUser._id ? null : <CloseIcon verticalAlign='center' boxSize={2} ms='1' />}
        </Badge>
    )
}

UserBadgeItem.propTypes = {
    user: PropTypes.object,
    handleFunction: PropTypes.func
}

export default UserBadgeItem
