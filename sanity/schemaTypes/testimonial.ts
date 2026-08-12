import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Témoignages",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre court", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "displayName", title: "Nom affiche", type: "string" }),
    defineField({ name: "profile", title: "Profil", type: "string" }),
    defineField({ name: "city", title: "Ville / pays", type: "string" }),
    defineField({ name: "service", title: "Service utilise", type: "string" }),
    defineField({ name: "quote", title: "Témoignage", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "result", title: "Résultat ou bénéfice", type: "string" }),
    defineField({ name: "rating", title: "Satisfaction", type: "string" }),
    defineField({ name: "photo", title: "Photo ou avatar", type: "image", options: { hotspot: true } }),
    defineField({ name: "orderRank", title: "Ordre d'affichage", type: "number" }),
  ],
});
