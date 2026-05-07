import { defineField, defineType } from "sanity";

export default defineType({
  name: "speaker",
  title: "Intervenants",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", title: "Fonction", type: "string" }),
    defineField({ name: "specialty", title: "Specialite", type: "string" }),
    defineField({ name: "bio", title: "Bio courte", type: "text", rows: 3 }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "orderRank", title: "Ordre d'affichage", type: "number" }),
  ],
});
