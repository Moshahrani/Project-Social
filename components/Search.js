import React, { useEffect, useState } from 'react';
import axios from "axios";
import { List, Image, Search } from "semantic-ui-react";
import cookie from "js-cookie";
import Router from "next/router";
import baseUrl from "../utilities/baseUrl";

let cancel;

// already have "Search" import from semantic-ui
// component name avoids similarities in terms

function SearchComp() {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);;

  const handleChange = async e => {
    const { value } = e.target;
    setText(value);
    if (value.length === 0) return ;
    if (value.trim().length === 0) return;
  
     setText(value);
     setLoading(true);

    try {
      cancel && cancel()
      const CancelToken = axios.CancelToken;
      // send token from local storage
      const token = cookie.get("token");

      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken(canceler => {
          cancel = canceler;
        })
      });
ß
      if (res.data.length === 0) {
        results.length > 0 && setResults([]);
        return setLoading(false);
      }
       setResults(res.data);

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {

    if (text.length === 0 && loading) setLoading(false);
  }, [text]);

  return (
    <Search onBlur={() => {
      results.length > 0 && setResults([]);
      loading && setLoading(false);
      setText("");
    }}
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => {
        Router.push(`/${data.result.username}`)
      }}
    />
  );
}

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image src={profilePicUrl} alt="ProfilePic" avatar />
        <List.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};


export default SearchComp;

