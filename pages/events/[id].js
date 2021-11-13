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




const SingleEvent = ({itemData}) => {
  const AuthUser = useAuthUser();
const [inputName, setInputName] = useState(itemData.name);
const [inputDate, setInputDate] = useState(itemData.date);
const [statusMsg, setStatusMsg] = useState('');

const sendData = async () => {
  try {
    console.log("sending!");
    // try to update doc
    const docref = await firebase.firestore().collection("events").doc(itemData.id);
    const doc = docref.get();

    if (!doc.empty) {
      docref.update(
        {
          name: inputName,
          date: firebase.firestore.Timestamp.fromDate( new Date(inputDate) )

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
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<AddIcon color="gray.300" />}
        />
        <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Event Name" />
        <Input type="text" value={inputDate} onChange={(e) => setInputDate(e.target.value)} placeholder="Event Date" />
        
        <Button
          ml={2}
          onClick={() => sendData()}
        >
          Update
        </Button>
      </InputGroup>
      <Text>
        {statusMsg}
      </Text>
    </Flex>
  </>
);
};

export const getServerSideProps = withAuthUserTokenSSR ({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })
  (
  async ({ AuthUser, params }) => {
    // take this is id parameter from the url and construct a db query with it
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("events").doc(params.id).get();

    let itemData;
    if (!doc.empty) {
      let docData = doc.data();
      itemData = {
        id: doc.id,
        name: docData.name,
        date: new Date(docData.date.seconds * 1000).toDateString(),
      };
    } else {
      // no document found
      itemDate = null;
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