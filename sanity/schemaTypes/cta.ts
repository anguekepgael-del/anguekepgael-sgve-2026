import { defineField, defineType } from "sanity";

export default defineType({
  name: "cta",
  title: "CTA",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Texte du bouton", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "href", title: "Lien", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "context", title: "Contexte", type: "string", options: { list: ["global", "accueil", "service", "sgve-2026", "contact"] } }),
    defineField({ name: "style", title: "Style", type: "string", options: { list: ["primary", "secondary", "light"] } }),
  ],
});
