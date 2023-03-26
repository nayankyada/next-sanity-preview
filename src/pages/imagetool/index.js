import ImageTool from "@/components/imagetool";

export default function Index(props) {
  return <ImageTool aspect={props.aspect} />;
}

export const getServerSideProps = (context) => {
  const { query } = context;
  const aspect = query.aspect;
  return { props: { aspect: aspect || "1/1" } };
};
