import { PreviewSuspense } from "next-sanity/preview";
import { usePreview } from "../../lib/sanity.preview";
import { groq } from "next-sanity";
import ReactHtmlParser from "react-html-parser";


const ReactHtmlPreview = (props) => {
  const query = groq`*[ _id == "${props.id}"]{...}`;
  const data  = usePreview(null,query)
  console.log(data)
  return <>{ReactHtmlParser(data[0]?.code?.code)}</>;
  // return <div dangerouslySetInnerHTML={{__html: data[0]?.code?.code}} />

}

export default function HTMLPreview(props) {
  return (
    <PreviewSuspense fallback="Loading...">
      <ReactHtmlPreview id={props.id}/>
    </PreviewSuspense>
  );
}

export const getServerSideProps = (context) => {
  const { query } = context;
  const id = query.id;
  return { props: { id: id || "" } };
};
