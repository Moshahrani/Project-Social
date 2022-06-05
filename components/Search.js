import React, { useState } from 'react';
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

      if (res.data.length === 0) {
        return setLoading(false);
      }

      setResults(result.data);

    } catch (error) {
      console.log("Error Searching");
    }
    setLoading(false);

  };



  return (
    <Search onBlur={() => {
      results.length > 0 && setResults([]);
    }}
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => {
        console.log(data.result);
        //Router.push(`/${data.result.username}`)
      }}
    />
  );
}

const ResultRenderer = props => {
  console.log(props);

  return <div></div>
}

// const ResultRender = ({ _id, profilePicUrl, name }) => {
//   return (
//     <List key={_id}>
//       <List.Item>
//         <Image src={profilePicUrl} alt="ProfilePic" avatar />
//         <List.Content header={name} as="a" />
//       </List.Item>
//     </List>
//   );
// };

export default SearchComp;

