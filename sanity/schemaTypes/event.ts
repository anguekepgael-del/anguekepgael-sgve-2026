import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Evenements",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "fullName", title: "Nom complet", type: "string" }),
    defineField({ name: "slogan", title: "Slogan", type: "string" }),
    defineField({ name: "dateLabel", title: "Date affichee", type: "string" }),
    defineField({ name: "timeLabel", title: "Heure affichee", type: "string" }),
    defineField({ name: "startDateTime", title: "Date et heure ISO", type: "datetime" }),
    defineField({ name: "location", title: "Lieu", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 5 }),
    defineField({ name: "totalSeats", title: "Nombre de places", type: "number" }),
    defineField({ name: "program", title: "Programme", type: "array", of: [{ type: "object", fields: [{ name: "time", type: "string" }, { name: "title", type: "string" }, { name: "description", type: "text" }] }] }),
    defineField({ name: "speakers", title: "Intervenants", type: "array", of: [{ type: "reference", to: [{ type: "speaker" }] }] }),
    defineField({ name: "faqs", title: "FAQ evenement", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
    defineField({ name: "whatsappCta", title: "CTA WhatsApp", type: "string" }),
    defineField({ name: "registrationCta", title: "CTA inscription", type: "string" }),
    defineField({ name: "heroImage", title: "Image hero", type: "image", options: { hotspot: true } }),
    defineField({ name: "emailSubject", title: "Sujet email billet", type: "string" }),
    defineField({ name: "emailBody", title: "Texte email billet", type: "text", rows: 6 }),
    defineField({ name: "seoTitle", title: "Titre SEO", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3 }),
  ],
});
