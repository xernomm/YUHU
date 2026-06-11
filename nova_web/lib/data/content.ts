import type { Testimonial } from "@/lib/types";

export const heroSlides = [
  {
    eyebrow: "Apa itu Nova",
    title: "Platform usaha untuk produk berkualitas & kemandirian Anda",
    body: "Nova memberikan produk-produk berkualitas tinggi dan peluang usaha yang bisa Anda jalankan secara mandiri — dari mana saja.",
    image: "/products/fiberme.jpeg",
    imageAlt: "Produk Fiberme dari Nova",
  },
  {
    eyebrow: "Produk Pilihan",
    title: "Produk kesehatan & kecantikan yang memang dibutuhkan",
    body: "Dari nutrisi harian sampai perawatan diri — katalog Nova dipilih agar mudah dijual karena dipakai sehari-hari.",
    image: "/products/yulips-lipcream.jpeg",
    imageAlt: "Yulips Lipcream dari Nova",
  },
  {
    eyebrow: "Cara Bergabung & Manfaat",
    title: "Bergabung mudah, manfaatnya berkelanjutan",
    body: "Registrasi, aktivasi, lalu mulai jualan. Sistem komisi transparan mendukung pendapatan yang bertumbuh.",
    image: "/products/repairing-hair-shampoo.jpeg",
    imageAlt: "Repairing Hair Shampoo dari Nova",
  },
] as const;

export const aboutNova = {
  lead: "Platform usaha yang memberikan produk-produk berkualitas tinggi & peluang usaha secara mandiri.",
  body: "Nova dirancang sebagai ekosistem bisnis yang mendukung pertumbuhan pendapatan berkelanjutan melalui produk-produk berkualitas tinggi.",
  vision:
    "Menjadi platform pemberdayaan masyarakat global yang paling inklusif dalam industri kesehatan dan kecantikan.",
} as const;

export const valueCards = [
  {
    title: "Struktur Jelas",
    body: "Sistem dirancang agar mudah dipahami, mulai dari registrasi hingga penjualan.",
  },
  {
    title: "Mudah Disesuaikan",
    body: "Setiap fitur fleksibel untuk mendukung kebutuhan bisnis yang terus berkembang.",
  },
  {
    title: "Siap Dikembangkan",
    body: "Platform mendukung penambahan fitur seperti promosi, edukasi, dan sistem lanjutan.",
  },
] as const;

export const opportunities = [
  "Brand siap pakai dengan tampilan profesional",
  "Katalog produk dan sistem order yang rapi",
  "Bisa dijalankan dari rumah atau mobile",
  "Peluang membangun tim dan jaringan",
  "Fleksibel usaha sampingan atau utama",
  "Sistem komisi dan pembayaran transparan",
] as const;

export const joinSteps = [
  {
    title: "Baca Penjelasan",
    body: "Pahami cara kerja Nova, produknya, dan skema kemitraannya sebelum memutuskan.",
  },
  {
    title: "Registrasi Member",
    body: "Isi formulir registrasi dengan kode voucher dan data diri Anda.",
  },
  {
    title: "Aktivasi Akun",
    body: "Setujui kode etik dan aktivasi akun Anda dengan kode voucher.",
  },
  {
    title: "Mulai Jualan",
    body: "Akses katalog, bagikan referral Anda, dan mulai bangun jaringan.",
  },
] as const;

export const testimonials: Testimonial[] = [
  {
    name: "Yola",
    role: "Member Nova",
    quote:
      "Sistemnya mudah dipahami, saya bisa langsung mulai jualan tanpa pengalaman sebelumnya.",
  },
  {
    name: "Rizka Auliya",
    role: "Reseller Nova",
    quote: "Produknya mudah dijual karena memang dibutuhkan sehari-hari.",
  },
];

export const codeOfEthics = [
  {
    title: "Pasal 1 — Integritas Usaha",
    body: "Setiap member wajib menjalankan usaha dengan jujur, tidak menyesatkan calon mitra maupun konsumen, dan tidak membuat klaim berlebihan terhadap produk maupun penghasilan.",
  },
  {
    title: "Pasal 2 — Representasi Produk",
    body: "Member hanya boleh menyampaikan manfaat produk sesuai informasi resmi yang diterbitkan Nova. Dilarang mengubah, menambah, atau mengurangi klaim khasiat produk.",
  },
  {
    title: "Pasal 3 — Harga Resmi",
    body: "Member wajib menjual produk sesuai harga resmi yang ditetapkan. Perang harga, banting harga, atau penjualan di bawah harga resmi merupakan pelanggaran.",
  },
  {
    title: "Pasal 4 — Perekrutan yang Beretika",
    body: "Perekrutan mitra baru wajib dilakukan secara transparan. Dilarang memaksa, menjanjikan kekayaan instan, atau menyembunyikan kewajiban yang melekat pada kemitraan.",
  },
  {
    title: "Pasal 5 — Penggunaan Merek",
    body: "Logo, nama, dan materi promosi Nova hanya boleh digunakan sesuai panduan resmi. Pembuatan akun, website, atau materi yang mengatasnamakan Nova tanpa izin dilarang.",
  },
  {
    title: "Pasal 6 — Data dan Privasi",
    body: "Member wajib menjaga kerahasiaan data pribadi konsumen dan sesama member, serta tidak menyalahgunakan data untuk kepentingan di luar aktivitas resmi Nova.",
  },
  {
    title: "Pasal 7 — Sanksi",
    body: "Pelanggaran terhadap kode etik dapat dikenakan sanksi berupa teguran, pembekuan akun, hingga pencabutan keanggotaan tanpa pengembalian biaya aktivasi.",
  },
] as const;

export const banks = [
  "BCA",
  "BNI",
  "BRI",
  "Mandiri",
  "BSI",
  "CIMB Niaga",
  "Danamon",
  "Permata",
  "BTN",
  "Bank Jago",
  "SeaBank",
  "Bank Sumsel Babel",
] as const;

export const provinces = [
  "Sumatera Selatan",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Banten",
  "Lampung",
  "Sumatera Utara",
] as const;

export const couriers = [
  { id: "jne", name: "JNE Reguler", eta: "2-4 hari", price: 18_000 },
  { id: "jnt", name: "J&T Express", eta: "2-3 hari", price: 20_000 },
  { id: "sicepat", name: "SiCepat BEST", eta: "1-2 hari", price: 28_000 },
] as const;

export const paymentMethods = [
  { id: "transfer", name: "Transfer Bank", detail: "BCA, BNI, BRI, Mandiri" },
  { id: "ewallet", name: "E-Wallet", detail: "OVO, GoPay, DANA, ShopeePay" },
  { id: "cod", name: "COD", detail: "Bayar di tempat saat paket tiba" },
] as const;

export const faqs = [
  {
    q: "Apa itu Nova?",
    a: "Nova adalah platform usaha yang menyediakan produk kesehatan dan kecantikan berkualitas tinggi beserta peluang usaha yang bisa dijalankan secara mandiri.",
  },
  {
    q: "Bagaimana cara bergabung menjadi member Nova?",
    a: "Baca penjelasan di halaman utama, lakukan registrasi member dengan kode voucher, aktivasi akun Anda, lalu mulai jualan.",
  },
  {
    q: "Apakah saya bisa menjalankan usaha Nova dari rumah?",
    a: "Bisa. Seluruh sistem Nova — katalog, order, dan jaringan — dapat dijalankan dari rumah maupun perangkat mobile.",
  },
  {
    q: "Bagaimana sistem komisi Nova?",
    a: "Nova menggunakan sistem komisi dan pembayaran yang transparan, dapat dipantau langsung dari dashboard member.",
  },
] as const;
