import React, { useState, useEffect, useRef } from "react";
import { Button, Checkbox, Divider, Form, List, Message } from "semantic-ui-react";
import { passwordUpdate, toggleMessagePopup } from "../../utilities/profileEvents";

function Settings({ newMessagePopup }) {

    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const [showMsgSettings, setShowMsgSettings] = useState(false);
    const [popupSetting, setPopupSetting] = useState(newMessagePopup);

    const isFirst = useRef(true);


    useEffect(() => {
        success && setTimeout(() => setSuccess(false), 3000);
    }, [success]);

    return (
        <>
            {success && (
                <>
                    <Message success icon="check circle" header="Updated Successfully" />
                    <Divider hidden />
                </>
            )}

            <List size="huge" animated>
                <List.Item>
                    <List.Icon name="user secret" size="large" verticalAlign="middle" />
                    <List.Content>
                        <List.Header
                            as="a"
                            content="Update Password"
                            onClick={() => setShowUpdatePassword(!showUpdatePassword)}
                        />
                    </List.Content>
                    {showUpdatePassword && (
                        <UpdatePassword
                            setSuccess={setSuccess}
                            setShowUpdatePassword={setShowUpdatePassword}
                        />
                    )}
                </List.Item>
                <Divider />

                <List.Item>
                    <List.Icon
                        name="paper plane outline"
                        size="large"
                        verticalAlign="middle" />

                    <List.Content>
                        <List.Header
                            onClick={() => setShowMsgSettings(!showMsgSettings)}
                            as="a"
                            content="Show New Message Popup?"
                        />
                    </List.Content>
                    
                    {showMsgSettings && (
                    <div style={{ marginTop: "10px" }}>
                        Control whether a Popup should appear when there is a New Message or not.
                        <br />
                        <br />
                        <Checkbox
                            checked={popupSetting}
                            toggle
                            onChange={() => {}}
                        />
                    </div>
                    )}
                </List.Item>

                <Divider />
            </List>
        </>
    );
}

const UpdatePassword = ({ setSuccess, setShowUpdatePassword }) => {

    // basic loading and error message states 
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const [userPasswords, setUserPasswords] = useState({
        currentPassword: "",
        newPassword: ""
    });

    // password input show option state   
    const [typed, showTyped] = useState({
        field1: false,
        field2: false
    });

    const { currentPassword, newPassword } = userPasswords;
    const { field1, field2 } = typed;

    const handleChange = e => {
        const { name, value } = e.target;
        setUserPasswords(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        errorMsg && setTimeout(() => setError(null), 5000);
    }, [errorMsg]);

    return (
        <>
            <Form
                error={errorMsg !== null}
                loading={loading}
                onSubmit={e => e.preventDefault()}>
                <List.List>
                    <List.Item>
                        {/* Form field for current password */}
                        <Form.Input
                            fluid
                            icon={{
                                name: "eye",
                                circular: true,
                                link: true,
                                // toggle field state to oppposite of boolean when click event
                                onClick: () => showTyped(prev => ({ ...prev, field1: !field1 }))
                            }}
                            type={field1 ? "text" : "password"}
                            iconPosition="left"
                            label="Current Password"
                            placeholder="Enter current Password"
                            name="currentPassword"
                            onChange={handleChange}
                            value={currentPassword}
                        />
                        {/* Form field for new password */}
                        <Form.Input
                            fluid
                            icon={{
                                name: "eye",
                                circular: true,
                                link: true,
                                onClick: () => showTyped(prev => ({ ...prev, field2: !field2 }))
                            }}
                            type={field2 ? "text" : "password"}
                            iconPosition="left"
                            label="New Password"
                            placeholder="Enter New Password"
                            name="newPassword"
                            onChange={handleChange}
                            value={newPassword}
                        />

                        {/* buttons to configure || cancel */}
                        <Button
                            disabled={loading || currentPassword === "" || newPassword === ""}
                            compact
                            icon="configure"
                            type="submit"
                            color="teal"
                            content="Confirm"
                        />

                        <Button
                            disabled={loading}
                            compact
                            icon="cancel"
                            type="button"
                            content="Cancel"
                            onClick={() => setShowUpdatePassword(false)}
                        />

                        <Message icon="meh" error header="Oops!" content={errorMsg} />
                    </List.Item>
                </List.List>
            </Form>
            <Divider hidden />
        </>
    );
};

export default Settings;