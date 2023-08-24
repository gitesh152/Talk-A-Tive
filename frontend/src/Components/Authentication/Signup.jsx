import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import validator from 'validator';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setloading] = useState(false);
    const [toggle, setToggle] = useState(false);
    const toast = useToast();
    const Navigate = useNavigate();

    const handleToggle = () => {
        setToggle(prev => !prev);
    }

    const postPic = (file) => {
        setloading(true);
        if (file === undefined) {
            toast({
                title: 'Please select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            const data = new FormData();
            data.append('file', file)
            data.append('upload_preset', "uploads")
            data.append('cloud_name', 'dm34wmjlm');
            fetch('https://api.cloudinary.com/v1_1/dm34wmjlm/image/upload', {
                method: 'post',
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Uploaded pic :', data)
                    setPic(data.url.toString())
                    setloading(false)
                })
                .catch(err => {
                    console.log(err)
                    setloading(false)
                })
        }
        else {
            toast({
                title: 'Please select png/jpeg type image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setloading(false)
            return;
        }
    }

    const handleSubmit = async () => {
        setloading(true)
        if (!name || !email || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            toast({
                title: 'Password does not match!',
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
            const { data } = await axios.post('/api/user/signup', {
                name, email, password, pic
            }, config);
            toast({
                title: `Registration Successful`,
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
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" value={email} type='email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder="Enter password" value={password} type={toggle ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h="1.75rem" size="sm" onClick={handleToggle}>{toggle ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirmPassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input placeholder="Confirm password" value={confirmPassword} type={toggle ? 'text' : 'password'} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h="1.75rem" size="sm" onClick={handleToggle}>{toggle ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload your pic</FormLabel>
                <Input type="file" p='1.5' accept="image/*" onChange={(e) => postPic(e.target.files[0])} />
            </FormControl>
            <Button mt='15px' w='100%' colorScheme='blue' onClick={handleSubmit} isLoading={loading}>Sign Up</Button>
        </VStack>
    )
}

export default Signup
