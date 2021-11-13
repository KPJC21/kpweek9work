import React, { useState, useEffect } from 'react';
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
    Link,
    Container,
    Header,
    List,
    ListItem,
    Stack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, StarIcon, CalendarIcon, PhoneIcon, EditIcon } from "@chakra-ui/icons"
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import NewHeader from '../../components/NewHeader';

const SingleEvent = ({itemData}) => {
    const AuthUser = useAuthUser();
    const [inputTodo, setTodo] = useState(itemData.todo)
    const [statusMsg, setStatusMsg] = useState('');
    const [todos, setTodos] = useState([])
    

    const sendData = async () => {
      try {
        console.log("sending!");
        // try to update doc
        const docref = await firebase.firestore().collection("todos").doc(itemData.id);
        const doc = docref.get();
    
        if (!doc.empty) {
          docref.update(
            {
              todo: inputTodo,
    
            }
          );
          setStatusMsg("Updated!");
        }
    
      } catch (error) {
        console.log(error);
      }
    }

    return (

      <>
         <NewHeader
      email={AuthUser.email} 
      signOut={AuthUser.signOut} />
         <Flex flexDir="column" maxW={800} align="center" justify="start" minH="100vh" m="auto" px={4} py={3}>
                           <Flex align="center">
                             
                               <List  style={{ marginLeft: '.5rem' }}>
                                 <ListItem fontSize={{ base: "18px", md: "20px", lg: "30px" }}>
                                 
                                   
                                     {itemData?.todo_name}
                                 </ListItem>
                                 
                             </List>
                           </Flex>
         <Stack width={{base: 'auto', sm: 'auto', md: 'auto'}}  pb={7} justifyContent="space-between"  spacing={4} direction={{base: 'column', md: 'row', sm:'column'}} alignItems="center">
             <AddIcon color="gray.300" />
             <Input fontSize={{ base: "18px", md: "20px", lg: "30px" }} variant="flushed" type="first_name" value={inputTodo} onChange={(e) => setTodo(e.target.value)} placeholder="What's the todo?" />
               <Button
                  ml={2}
                  onClick={() => sendData()}
               >
                   Update!
               </Button>
           </Stack>
           </Flex>
      </>
 );
 };
 export const getServerSideProps = withAuthUserTokenSSR ({
     whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
   })(
     async ({ AuthUser, params }) => {
     // take this is id parameter from the url and construct a db query with it
     const db = getFirebaseAdmin().firestore();
     const doc = await db.collection("todos").doc(params.id).get();
     let itemData;
     
     if (!doc.empty) {
       let docData = doc.data();
       itemData = {
         id: doc.id,
         todo_name: docData.todo,
 
       };
     } else {
       // no document found
       itemData = null;
     }
     
     // return the data
     return {
       props: {
         itemData
       }
     }
   }
 )
 
 export default withAuthUser({
     whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
     whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN
   })(SingleEvent)