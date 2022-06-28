import React from "react";
import { Form, Segment } from "semantic-ui-react";


function MessageField({ socket, user, messagesWith }) {

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);


    return (

        <div style={{ position: "sticky", bottom: "0" }}>
            <Segment secondary color="teal" attached="bottom">
                <Form reply onSubmit={e => e.preventDefault()}>
                    <Form.Input
                        action={{
                            color: "blue",
                            icon: "telegram place",
                            disabled: text === "",
                            loading: loading
                        }}
                        size="large"
                        placeholder="Send New Message"
                        value={text}
                        onChange={(e) => setText(e.target.value)} />
                </Form>
            </Segment>
        </div>

    )
}

export default MessageField