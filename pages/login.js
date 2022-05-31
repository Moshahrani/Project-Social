import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Message, Segment, TextArea, Divider } from "semantic-ui-react";
import { HeaderMessage, FooterMessage } from "../components/Basic/WelcomeMessage";
import { loginUser } from "../utilities/authUser";


function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    })

    const { email, password } = user;
    const [formLoading, setFormLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target

        setUser(prev => ({ ...prev, [name]: value }))
    };

    useEffect(() => {
        const isUser = Object.values({
            email,
            password,
        }).every(item => Boolean(item));

        isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);

    }, [user]);

    const handleSubmit = async e => { 
        e.preventDefault();

        await loginUser(user, setErrorMessage, setFormLoading);
    };
    
    return (
        <>
            <HeaderMessage />
            <Form loading={formLoading} error={errorMessage !== null} onSubmit={handleSubmit}>
                <Message error header="Oops" content={errorMessage} onDismiss={() => setErrorMessage(null)} />
                <Segment>
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
                    <Divider hidden />
                    <Button
                        icon="signup"
                        content="Login"
                        type="submit"
                        color="green"
                        disabled={submitDisabled} />
                </Segment>
            </Form>
            <FooterMessage />
        </>
    );
};

export default Login;
