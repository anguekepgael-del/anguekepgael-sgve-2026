import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "heroTitle", title: "Titre hero", type: "string" }),
    defineField({ name: "heroText", title: "Texte hero", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Contenu", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seoTitle", title: "Titre SEO", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3 }),
  ],
});
