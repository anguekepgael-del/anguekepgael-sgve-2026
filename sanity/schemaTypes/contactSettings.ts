import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactSettings",
  title: "Contacts",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Libelle", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Telephone", type: "string" }),
    defineField({ name: "whatsapp", title: "Lien WhatsApp", type: "url" }),
    defineField({ name: "address", title: "Adresse", type: "string" }),
    defineField({ name: "notes", title: "Notes internes", type: "text", rows: 3 }),
  ],
});
