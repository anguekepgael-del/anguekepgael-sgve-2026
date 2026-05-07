import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || "replace-me";
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || "production";

export default defineConfig({
  name: "cf-consulting-travel",
  title: "CF Consulting Travel CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
