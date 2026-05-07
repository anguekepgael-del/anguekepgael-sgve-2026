import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Articles de blog",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "category", title: "Categorie", type: "reference", to: [{ type: "category" }] }),
    defineField({ name: "excerpt", title: "Introduction / extrait", type: "text", rows: 4 }),
    defineField({ name: "mainImage", title: "Image principale", type: "image", options: { hotspot: true } }),
    defineField({ name: "sections", title: "Sections", type: "array", of: [{ type: "object", fields: [{ name: "heading", title: "Titre", type: "string" }, { name: "body", title: "Texte", type: "text", rows: 5 }] }] }),
    defineField({ name: "publishedAt", title: "Date de publication", type: "datetime" }),
    defineField({ name: "seoTitle", title: "Titre SEO", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3 }),
  ],
});
