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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, StarIcon, CalendarIcon, PhoneIcon, EditIcon } from "@chakra-ui/icons"
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import NewHeader from '../../components/NewHeader';

const SingleTEvent = ({itemData}) => {
    const AuthUser = useAuthUser();
    const [inputTodo, setTodo] = useState('')
    const [todos, setTodos] = useState([])

    return (

      <Container maxWidth="container.xl" alignItems="center" py={[0, 10, 20]}>
         <Header email={AuthUser.email} signOut={AuthUser.signOut} />
         <Flex h={{base: 'auto',  sm: 'auto', md:'auto'}} justifyContent="space-between" alignItems="center"direction={{base: 'column-reverse', md: 'row'}}>
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
                   ml={12}
                   style={{ marginLeft: '.5rem' }}
               >
                   Update!
               </Button>
           </Stack>
           </Flex>
 
     </Container>
 
 );
 };
 export const getServerSideProps = withAuthUserTokenSSR ({
     whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
   })(
     async ({ AuthUser, params }) => {
     // take this is id parameter from the url and construct a db query with it
     const db = getFirebaseAdmin().firestore();
     const doc = await db.collection("my_todos").doc(params.id).get();
     let itemData;
     
     if (!doc.empty) {
       let docData = doc.data();
       itemData = {
         id: doc.id,
         todo_name: docData.todo
 
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