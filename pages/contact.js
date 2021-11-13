import React, { useState, useEffect } from 'react'
import {
    Flex,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    IconButton,
    Divider,
    HStack,
    Link,
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon, StarIcon, PhoneIcon, EditIcon } from "@chakra-ui/icons"
import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth'
import getAbsoluteURL from '../utils/getAbsoluteURL'
import firebase from 'firebase/app'
import 'firebase/firestore'
import NewHeader from '../components/NewHeader'
import DarkModeSwitch from '../components/DarkModeSwitch'




const Contact = () => {
  const AuthUser = useAuthUser()
  const [inputFirstName, setInputFirstName] = useState('')
  const [inputLastName, setInputLastName] = useState('')
  const [inputAddress, setInputAddress] = useState('')
  const [inputNumber, setInputNumber] = useState('')
  const [contacts, setContacts] = useState([])
  

  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection("contacts")
        .where( 'user', '==', AuthUser.id )
        .onSnapshot(
          snapshot => {
            setContacts(
              snapshot.docs.map(
                doc => {
                  return {
                    contactID: doc.id,
                    contactFirstName: doc.data().firstName,
                    contactLastName:
                    doc.data().lastName,
                    contactAddress: doc.data().address,
                    contactNumber: doc.data().number,
                  }
                }
              )
            );
          }
        )
  })

  const sendData = () => {
    try {
      // try to update doc
      firebase
        .firestore()
        .collection("contacts") // all users will share one collection

        .add({
          firstName: inputFirstName,
          lastName: inputLastName,
          address: inputAddress,
          number: inputNumber,
          user: AuthUser.id,
        })
        
      // flush out the user-entered values in the input elements onscreen
      .then(console.log('New Contact sent to Firestore!'));
      setInputFirstName('');
      setInputLastName('');
      setInputAddress('');
      setInputNumber('');

    } catch (error) {
      console.log(error)
    }
  }

  const updateContact = async (t, contactFirstName, contactLastName, contactAddress, contactNumber) => {
    try {
      const editContact = {contactFirstName: setInputFirstName, contactLastName: setInputLastName, contactAddress: setInputAddress, contactNumber: setInputNumber}
      firebase
        .firestore()
        .collection("contacts")
        .doc(t)
        .update(editContact)
        .then(console.log("Contact updated."))
    } catch(error) {
      console.log(error)
    }
  }

  const deleteContact = (t) => {
    try {
      firebase
        .firestore()
        .collection("contacts")
        .doc(t)
        .delete()
        .then(console.log('Data successfully deleted!'))
    } catch (error) {
      console.log(error)
    }
  }

    return (
      <>

      <NewHeader
      email={AuthUser.email} 
      signOut={AuthUser.signOut} />
 <Heading p={7} bgGradient="linear(to-l, #1418f5, #4548e6)"
                bgClip="text" align="center" fontSize={{ base: "20px", md: "30px", lg: "70px" }}>Welcome, {AuthUser.email}!</Heading>

      <Flex flexDir="column" maxW={800} align="center" justify="center" minH="100vh" m="auto" px={4}>
        <Flex justify="space-between" w="100%" align="center">
        <Flex p={7} alignItems="center">
                    <DarkModeSwitch />
                    <IconButton ml={2} onClick={AuthUser.signOut} icon={<StarIcon />} />
                </Flex>
          
          <Flex>
            
            <IconButton ml={2} onClick={AuthUser.signOut} icon={<StarIcon />} />
          </Flex>
        </Flex>

        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<AddIcon color="gray.300" />}
          />
          <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="First Name" />
                    <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" />
                    <Input type="Address" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="Home Address" />
                    <Input type="Phone Number" value={inputNumber} onChange={(e) => setInputNumber(e.target.value)} placeholder="123-456" />
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Add
          </Button>
        </InputGroup>

        {contacts.map((item, i) => {
          return (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Flex
                w="100%"
                p={5}
                my={2}
                align="center"
                borderRadius={5}
                justifyContent="space-between"
              >
               <HStack spacing={6} w="full" >
                <Flex align="center">
                  <Text fontSize="xl" mr={4}>{i + 1}.</Text>
               <Link href={"/contacts/" + item.contactID} >
                                    {item.contactFirstName} {item.contactLastName} {item.contactAddress} {item.contactNumber}
                                </Link>          
                </Flex>
                </HStack>
                <IconButton onClick={() => deleteContact(item.contactID)} icon={<DeleteIcon />} />
              </Flex>
            </React.Fragment>
          )
        })}
      </Flex>
       </>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  return {
    props: {
    }
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Contact)