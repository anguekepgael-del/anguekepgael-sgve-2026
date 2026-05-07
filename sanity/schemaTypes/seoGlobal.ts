import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoGlobal",
  title: "SEO global",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", title: "Titre global", type: "string" }),
    defineField({ name: "defaultMetaDescription", title: "Meta description par defaut", type: "text", rows: 3 }),
    defineField({ name: "ogImage", title: "Image Open Graph", type: "image", options: { hotspot: true } }),
    defineField({ name: "robots", title: "Robots", type: "string", initialValue: "index, follow" }),
  ],
});
