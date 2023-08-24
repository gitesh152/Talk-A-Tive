import { Box, Container, Text, Tab, TabList, Tabs, TabPanel, TabPanels } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const Navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) Navigate('/chats')
    }, [Navigate])
    return (
        <Container maxW={'xl'} centerContent>
            <Box
                display={'flex'}
                justifyContent={'center'}
                p={3}
                m={"40px 0px 15px 0px"}
                borderRadius={"lg"}
                borderWidth={"1px"}
                bg={"white"}
                w={"100%"}
            >
                <Text color={'black'} fontFamily={'Poppins'} fontSize={'3xl'}>Talk-A-Tive</Text>
            </Box>
            <Box bg={'white'} borderRadius={'lg'} p={3} w="100%">
                <Tabs variant='soft-rounded' colorScheme='blue'>
                    <TabList mb='1em'>
                        <Tab w="50%" >Login</Tab>
                        <Tab w="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage
