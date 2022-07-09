import React from "react";
import {
    Placeholder,
    Divider,
    List,
    Button,
    Card,
    Container,
    Icon
} from "semantic-ui-react";

const genArray = length => {
    const newArr = new Array(length);

    for (let i = 0; i < newArr.length; i++) {
        newArr[i] = i;
    }
    return newArr;
};

export const LikesPlaceHolder = () =>
    genArray(6).map(item => (
        <Placeholder key={item} style={{ minWidth: "200px" }}>
            <Placeholder.Header image>
                <Placeholder.Line length="full" />
            </Placeholder.Header>
        </Placeholder>
    )
    );

export const PlaceHolderPosts = () =>
    genArray(3).map(item => (
        <div key={item}>
            <Placeholder fluid>
                <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Paragraph>
            </Placeholder>
            <Divider hidden />
        </div>
    ));

// no more posts to fetch from the backend
export const EndMessage = () => (
    <Container textAlign="center">
        <Icon name="refresh" size="large" />
        <Divider hidden />
    </Container>
);


