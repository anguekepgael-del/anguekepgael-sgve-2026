import { defineField, defineType } from "sanity";

export default defineType({
  name: "country",
  title: "Pays accompagnes",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Pays", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "code", title: "Code court", type: "string" }),
    defineField({ name: "flag", title: "Drapeau / visuel", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "orderRank", title: "Ordre d'affichage", type: "number" }),
  ],
});
