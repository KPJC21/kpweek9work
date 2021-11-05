import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import {
  Container,
  Flex,
  Heading,
  Link,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Text,
  IconButton,
  Divider,
  List,
  ListItem,
  Stack
} from "@chakra-ui/react"
import firebase from 'firebase/app'
import 'firebase/firestore'
import Header from '../components/Header'
import DemoPageLinks from '../components/DemoPageLinks'
import { TimeIcon, PhoneIcon, CalendarIcon, StarIcon, CloseIcon, LockIcon, UnlockIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
}

const Demo = () => {
  const AuthUser = useAuthUser()
  return (
    <div className="background">
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <Heading style={{ fontSize: "40px" }}
                                    bgClip="text">Organize.com </Heading>
          <h3 spacing={2} style={{ marginBottom: "10px" }}> Schedule your contacts, events, and todos to organize your life.</h3>
          
          <p >
          <Link href="/event" textDecoration="none">

          <Button leftIcon={<CalendarIcon />} color="blue"
            fontWeight="bold"
            py={17}
            variant="outline"
            
            borderRadius="md"
          
            _hover={{
              
            }}  >
          Add an event!
        </Button>

       
        </Link>
        </p>
        <p>
        <Link href="/todo" textDecoration="none">

          <Button leftIcon={<StarIcon />} color="blue"
            fontWeight="bold"
            variant="outline"
            py={17}
            borderRadius="md"
            textDecoration="none"
            
            _hover={{
              
            }}  >
          Add a todo!
        </Button>
  
        </Link>
        </p>
   
        <p>
        <Link href="/contact" textDecoration="none">

          <Button leftIcon={<PhoneIcon />} color="blue"
            fontWeight="bold"
            variant="outline"
            borderRadius="md"
            textDecoration="none"
            py={17}
            
            _hover={{
              
            }}  >
          Add a contact!
        </Button>

        </Link>
        </p>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Demo)
