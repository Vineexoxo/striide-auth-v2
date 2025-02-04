import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export const dynamic = "force-dynamic"; // Add this line to force dynamic rendering


export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}