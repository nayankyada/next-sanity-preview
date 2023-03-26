import { client } from "../../lib/sanity.client";
import ReactHtmlParser from "react-html-parser";
import { useEffect, useState } from "react";

const ReactHtmlPreview = (props) => {
  const [htmlCode, setHtmlCode] = useState("");
  useEffect(() => {
    client.getDocument(props.id).then(d => {setHtmlCode(d?.code?.code)})
  },[])
  return <>{ReactHtmlParser(htmlCode)}</>;
  // return <div dangerouslySetInnerHTML={{__html: data[0]?.code?.code}} />
};

export default function HTMLPreview(props) {
  return <ReactHtmlPreview id={props.id} />;
}

export const getServerSideProps = (context) => {
  const { query } = context;
  const id = query.id;
  return { props: { id: id || "" } };
};
