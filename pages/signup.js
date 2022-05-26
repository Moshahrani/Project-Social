import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Message, Segment, TextArea, Divider } from "semantic-ui-react";
import { HeaderMessage, FooterMessage } from "../components/Basic/WelcomeMessage";

function Signup() {

const [user, setUser] = useState({
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

const handleChange = (e) => {
    const {name,value} = e.target

    setUser(prev => ({ ...prev, [name]: value }))
};

const handleSubmit = e => e.preventDefault();

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
        <Form loading={formLoading} error={errorMessage !== null} onSubmit={handleSubmit}>
          <Message error header="Oops" content={errorMessage} onDismiss={() => setErrorMessage(null)} />
          <Segment>
              <Form.Input
              required
              fluid
              label="Name"
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleChange}
              icon="user"
              iconPosition="left"
              />

              <Form.Input
              required
              fluid
              label="Email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
              icon="envelope"
              iconPosition="left"
              type="email"
              />
              <Form.Input
              required
              fluid
              label="Password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              icon={{
                  name: "eye",
                  circular: true,
                  link: true,
                  onClick: () => setShowPassword(!showPassword)

              }}
              iconPosition="left"
              type={showPassword ? "text" : "password"}
              />
          </Segment>
        </Form>
        <FooterMessage />
        </>
    );
};

export default Signup;