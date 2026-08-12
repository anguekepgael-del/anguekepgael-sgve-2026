import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Parametres du site",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom du site", type: "string" }),
    defineField({ name: "url", title: "URL officielle", type: "url" }),
    defineField({ name: "owner", title: "Propriétaire / représentant légal", type: "string" }),
    defineField({ name: "primaryEmail", title: "Email principal", type: "string" }),
    defineField({ name: "secondaryEmail", title: "Email secondaire", type: "string" }),
    defineField({ name: "phoneFrance", title: "Téléphone France", type: "string" }),
    defineField({ name: "phoneCameroon", title: "Téléphone Cameroun", type: "string" }),
    defineField({ name: "addressFrance", title: "Adresse France", type: "string" }),
    defineField({ name: "whatsappFrance", title: "WhatsApp officiel", type: "url" }),
    defineField({ name: "whatsappCameroon", title: "Ancien WhatsApp secondaire (ne pas utiliser)", type: "url" }),
    defineField({ name: "whatsappChannel", title: "Chaine WhatsApp SGVE", type: "url" }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: false } }),
  ],
});
