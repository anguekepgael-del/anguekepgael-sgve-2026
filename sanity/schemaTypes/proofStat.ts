import { defineField, defineType } from "sanity";

export default defineType({
  name: "proofStat",
  title: "Chiffres cles / preuves",
  type: "document",
  fields: [
    defineField({ name: "value", title: "Valeur", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "label", title: "Libelle", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "orderRank", title: "Ordre d'affichage", type: "number" }),
  ],
});
