import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Services",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", title: "Resume court", type: "text", rows: 3 }),
    defineField({ name: "heroTitle", title: "Grand titre", type: "string" }),
    defineField({ name: "lead", title: "Introduction", type: "text", rows: 3 }),
    defineField({ name: "promiseTitle", title: "Titre promesse", type: "string" }),
    defineField({ name: "promise", title: "Promesse realiste", type: "text", rows: 3 }),
    defineField({ name: "problemTitle", title: "Titre probleme", type: "string" }),
    defineField({ name: "problem", title: "Probleme client", type: "text", rows: 3 }),
    defineField({ name: "solutionTitle", title: "Titre solution", type: "string" }),
    defineField({ name: "solution", title: "Solution CF Consulting Travel", type: "text", rows: 3 }),
    defineField({ name: "valuePoints", title: "Points de valeur", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "steps", title: "Etapes", type: "array", of: [{ type: "object", fields: [{ name: "title", type: "string" }, { name: "text", type: "text" }] }] }),
    defineField({ name: "documents", title: "Documents generalement necessaires", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "errors", title: "Erreurs a eviter", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "faqs", title: "FAQ service", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
    defineField({ name: "orderRank", title: "Ordre d'affichage", type: "number" }),
    defineField({ name: "seoTitle", title: "Titre SEO", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3 }),
  ],
});
