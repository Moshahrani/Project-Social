import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Message, Segment, TextArea, Divider } from "semantic-ui-react";
import { HeaderMessage, FooterMessage } from "../components/Basic/WelcomeMessage";

function Signup() {

const [user, setUser]=useState({
    name: "",
    email: "",
    password: "",
    bio: "", 
    facebook: "",
    youtube: "", 
    twitter: "",
    instagram: "",
})

const { name, email, password, bio } = user;

const [showSocialLinks, setShowSocialLinks] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [errorMessage, setErrorMessage] = useState(null);
const [formLoading, setFormLoading] = useState(false);
const [username, setUsername] = useState('');
const [usernameLoading, setUsernameLoading] = useState(false);
const [usernameAvailable, setUsernameAvailable] = useState(false);




    return (
        <>
        <HeaderMessage />
        <Form loading={formLoading} error={errorMessage !== null} >
          <Message error header="Oops" content={errorMessage} onDismiss={() => setErrorMessage(null)} />
          <Segment>
              <Form.Input
              label="Name"
              placeholder="Name"
              name="name"
              value={name}
              //onChange={handleChange}
              icon="user"
              iconPosition="left"
              />
          </Segment>
        </Form>
        <FooterMessage />
        </>
    );
};

export default Signup;