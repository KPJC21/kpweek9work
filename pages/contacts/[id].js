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
import { AddIcon } from "@chakra-ui/icons";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import NewHeader from '../../components/NewHeader';


const SingleEvent = ({itemData}) => {
const AuthUser = useAuthUser();

const [inputFirstName, setInputFirstName] = useState(itemData.firstname);
const [inputLastName, setInputLastName] = useState(itemData.lastname);
const [inputAddress, setInputAddress] = useState(itemData.address);
const [inputNumber, setInputNumber] = useState(itemData.number);
const [statusMsg, setStatusMsg] = useState('');

const sendData = async () => {
  try {
    console.log("sending!");
    // try to update doc
    const docref = await firebase.firestore().collection("contacts").doc(itemData.id);
    const doc = docref.get();

    if (!doc.empty) {
      docref.update(
        {
          firstName: inputFirstName,
          lastName: inputLastName,
          address: inputAddress,
          number: inputNumber,

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
        <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="Contact First Name" />
        <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Contact Last Name" />
        <Input type="text" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="Contact Address" />
        <Input type="text" value={inputNumber} onChange={(e) => setInputNumber(e.target.value)} placeholder="Contact Number" />
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

export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(
  async ({ AuthUser, params }) => {
    // take the id parameter from the url and construct a db query with it
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("contacts").doc(params.id).get();
    let itemData;
    if (!doc.empty) {
      // document was found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        firstName: docData.firstName,
        lastName: docData.lastName,
        address: docData.address,
        number: docData.number,
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

export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN
  }
)(SingleEvent)