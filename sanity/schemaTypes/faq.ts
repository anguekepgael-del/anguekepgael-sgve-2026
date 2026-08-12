import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "answer", title: "Réponse", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "scope", title: "Page ou contexte", type: "string", options: { list: ["general", "sgve-2026", "visa-etudiant", "visa-tourisme", "recours-visa", "contact"] } }),
    defineField({ name: "orderRank", title: "Ordre d'affichage", type: "number" }),
  ],
});
