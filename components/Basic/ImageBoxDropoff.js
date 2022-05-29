import React from "react";
import { Form, Segment, Image, Icon, Header } from "semantic-ui-react";

function ImageBoxDropoff({ highlight,
    setHighlight,
    inputRef,
    handleChange,
    mediaPreview,
    setMediaPreview,
    setMedia
}) {
    return (
        <>
            <Form.Field>
                <Segment placeholder basic secondary>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        name="media"
                        ref={inputRef}
                    />

                    <div
                    // function when user drags image over div
                        onDragOver={e => {
                            e.preventDefault();
                            setHighlight(true);
                        }}
                        onDragLeave={e => {
                            e.preventDefault();
                            setHighlight(false);
                        }}
                        // when user drops image onto div, 
                        onDrop={e => {
                            e.preventDefault();
                            setHighlight(true);
                            console.log(e.dataTransfer.files);
                        }}>
                        {mediaPreview === null ? (
                            <>
                                <Segment color={highlight ? "green" : ""} placeholder basic>
                                    <Header icon>
                                        <Icon
                                            name="file image outline"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => inputRef.current.click()}
                                        />
                                        Drag and Drop or Click to Upload Image
                                    </Header>
                                </Segment>
                            </>
                        ) : (
                            // show image preview if file not null
                            <>
                                <Segment color="green" placeholder basic>
                                    <Image
                                        src={mediaPreview}
                                        size="medium"
                                        centered
                                        style={{ cursor: "pointer" }}
                                        onClick={() => inputRef.current.click()}
                                    />
                                </Segment>
                            </>
                        )}
                    </div>
                </Segment>
            </Form.Field>
        </>
    );
};

export default ImageBoxDropoff;

