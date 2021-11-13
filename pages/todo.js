import React, { useState, useEffect } from 'react'
import {
    Flex,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    Link,
    IconButton,
    Divider,
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon, StarIcon, EditIcon } from "@chakra-ui/icons"
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

// imports here

const Todo = () => {
  const AuthUser = useAuthUser()
  const [inputTodo, setTodo] = useState('')
  const [todos, setTodos] = useState([])


  useEffect(() => {
      AuthUser.id &&
          firebase
              .firestore()
              .collection("todos")
              .where('user', '==', AuthUser.id)
              .onSnapshot(
              
                snapshot => {
                  setTodos(snapshot.docs.map(
                    doc => {
                      return  {
                        todoID: doc.id, 
                        todo: doc.data().todo
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
      .collection("todos") // each user will have their own collection
        .add({
        todo: inputTodo,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user: AuthUser.id,
        })
          .then(console.log('Data was successfully sent to cloud firestore!'));
          setTodo('');

        } catch (error) {
            console.log(error)
        }
    }

    const deleteTodo = (t) => {
        try {
            firebase
             .firestore()
             .collection("todos")
             .doc(t)
             .delete()
             .then(console.log('Data was successfully deleted!'))
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
          <Flex>
          <DarkModeSwitch />
            <IconButton ml={2} onClick={AuthUser.signOut} icon={<StarIcon />} />
          </Flex>
        </Flex>

<InputGroup>
        <InputLeftElement
            pointerEvents="none"
            children={<AddIcon color="gray.300" />}
        />
        <Input type="text" onChange={(e) => setTodo(e.target.value)} placeholder="Put in your new todo" />
        <Button
            ml={2}
            onClick={() => sendData()}
        >
            Add Todo
        </Button>
    </InputGroup>

        {todos.map((t, i) => {
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
                <Flex align="center">
                  <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                  <Text>{t.todo}</Text>
                </Flex>
                
                <IconButton onClick={() => deleteTodo(t.todoID)} icon={<DeleteIcon />} />
                <Link href={"/todos/" + t.todoID}>
                              <EditIcon />
                            </Link>
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
    // Optionally, get other props.
    // You can return anything you'd normally return from
    // `getServerSideProps`, including redirects.
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    const token = await AuthUser.getIdToken()
    const endpoint = getAbsoluteURL('/api/example', req)
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            Authorization: token || 'unauthenticated',
        },
    })
    const data = await response.json()
    if (!response.ok) {
        throw new Error(
          `Data fetching failed with status ${response.status}: ${JSON.stringify(
                data
            )}`
        )
    }
    return {
        props: {
            favoriteColor: data.favoriteColor,
        },
    }
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Todo)