import { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import validator from 'validator';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [toggle, setToggle] = useState(false);
    const [loading, setloading] = useState(false);
    const toast = useToast()
    const Navigate = useNavigate()

    const handleToggle = () => {
        setToggle(prev => !prev);
    }

    const handleSubmit = async () => {
        setloading(true)
        if (!email || !password) {
            toast({
                title: 'Please fill all the fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setloading(false)
            return
        }
        if (!validator.isEmail(email)) {
            toast({
                title: 'Please enter valid email!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setloading(false)
            return
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            const { data } = await axios.post('/api/user/login', { email, password }, config);
            toast({
                title: `Login Successful`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            localStorage.setItem('userInfo', JSON.stringify(data))
            setloading(false)
            Navigate('/chats')
        }
        catch (error) {
            toast({
                title: `Error Occured!`,
                description: error.response.data.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setloading(false)
            return
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='loginemail' isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={toggle ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h="1.75rem" size="sm" onClick={handleToggle} >{toggle ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme="blue" mt="15px" width="100%" onClick={handleSubmit} isLoading={loading}>Login</Button>
            <Button colorScheme="red" mt="15px" width="100%" onClick={() => {
                setEmail('guest@email.com')
                setPassword('123')
            }} >Get Guest User Credentials</Button>
        </VStack>
    )
}

export default Login
