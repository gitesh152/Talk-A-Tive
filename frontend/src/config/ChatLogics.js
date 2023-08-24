export const getSender = (user, users) => {
    return users[0]._id === user._id ? users[1].name : users[0].name
}

export const getFullSender = (user, users) => {
    return users[0]._id === user._id ? users[1] : users[0]
}

//show pic
export const isSender = (messages, m, i, userId) => {
    return (i < messages.length - 1 //check length constraints
        &&
        messages[i].sender._id !== userId   //dont show pic of current user
        && (
            messages[i + 1].sender._id === undefined    //if there is no next mesage
            ||                                                  //or
            messages[i + 1].sender._id !== m.sender._id //when current.sender != next.sender
        )
    )
}
export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1
        &&
        messages[messages.length - 1].sender._id
        &&
        messages[messages.length - 1].sender._id !== userId
    )
}

//set margin
export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId)
        ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0
    else return 'auto'
}
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id
}