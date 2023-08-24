import { Box } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider"
import SingleChat from "./SingleChat";

const ChatBox = () => {
    const { selectedChat } = ChatState();
    return (
        <Box
            display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
            alignItems='center'
            flexDir='column'
            p={3}
            bg={'white'}
            w={{ base: "100%", md: "68%" }}
            borderRadius={"lg"}
            borderWidth='5px'
            borderColor='blackAlpha.50'
        >
            <SingleChat />
        </Box>
    )
}

export default ChatBox
