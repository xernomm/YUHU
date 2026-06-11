export const site = {
  name: "NOVA OFFICIAL",
  shortName: "NOVA",
  tagline: "Produk berkualitas tinggi & peluang usaha mandiri",
  description:
    "NOVA OFFICIAL adalah platform usaha yang memberikan produk-produk kesehatan dan kecantikan berkualitas tinggi serta peluang usaha secara mandiri.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nova-official.vercel.app",
  themeColor: "#006241",
  contact: {
    address: "Jl. Kebon Dua Ratus, Sumatera Selatan 30114",
    whatsapp: "+62 123-4567-890",
    whatsappLink: "https://wa.me/621234567890",
    email: "nova.official@gmail.com",
  },
  social: {
    instagram: "https://instagram.com/nova.official",
    facebook: "https://facebook.com/nova.official",
  },
} as const;
