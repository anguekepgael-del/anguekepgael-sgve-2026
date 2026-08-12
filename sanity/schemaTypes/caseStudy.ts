import { defineField, defineType } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Études de cas",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "topic", title: "Sujet", type: "string" }),
    defineField({ name: "location", title: "Ville / pays", type: "string" }),
    defineField({ name: "issue", title: "Situation initiale", type: "text", rows: 3 }),
    defineField({ name: "work", title: "Travail realise", type: "text", rows: 3 }),
    defineField({ name: "benefit", title: "Benefice obtenu", type: "text", rows: 3 }),
    defineField({ name: "orderRank", title: "Ordre d'affichage", type: "number" }),
  ],
});
