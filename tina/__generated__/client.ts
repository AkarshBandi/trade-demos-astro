import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: "http://localhost:4001/graphql", token: "a5b35c5509bc1eea708a00ede41e56e19318bf94", queries,  });
export default client;
  