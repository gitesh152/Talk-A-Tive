import ScrollableFeed from 'react-scrollable-feed';
import PropTypes from 'prop-types'
import { isSender, isLastMessage, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState()
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', marginTop: isSameUser(messages, m, i) ? 3 : 12 }}>
                {(isSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id))
                    && <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                        <Avatar
                            src={m.sender.pic}
                            name={m.sender.name}
                            size='sm'
                            mr='2px'
                            cursor='pointer'
                        />
                    </Tooltip>
                }
                <span style={{
                    backgroundColor: m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    maxWidth: '75%',
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                }}>{m.content}</span>
            </div>)}
        </ScrollableFeed>
    )
}

ScrollableChat.propTypes = {
    messages: PropTypes.array
}

export default ScrollableChat
