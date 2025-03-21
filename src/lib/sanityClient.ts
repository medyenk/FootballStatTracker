import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: "production",
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
  useCdn: false,
});
