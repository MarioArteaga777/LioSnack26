// Paleta por producto usada para ilustrar el empaque (ver ProductVisual.jsx)
export const categories = [
  { id: "todos", label: "Todos" },
  { id: "frutas", label: "Frutas" },
  { id: "dulces", label: "Dulces" },
  { id: "mezclas", label: "Mezclas" },
];

export const products = [
  {
    id: "banano-espacial",
    name: "Banano Espacial",
    price: 3.5,
    category: "frutas",
    badge: "premium",
    description: "Bananos liofilizados al vacío para preservar el 95% de sus nutrientes originales.",
    extendedDescription: "Liofilizamos al vacío los mejores bananos de la galaxia para traerte un snack crujiente, dulce y 100% natural. ¡Energía pura y natural lista para abrir y disfrutar en órbita!",
    imagePath: "/Multimedia.jfif", // 📌 Pon tu imagen en public/images/banano-espacial.png
    tags: [
      { label: "Energía", icon: "zap" },
      { label: "Fibra", icon: "leaf" },
      { label: "Vitamina C", icon: "citrus" },
    ],
    planetHue: "gold",
    moonHue: "stardust",
  },
  {
    id: "manzana-espacial",
    name: "Manzana Espacial",
    price: 3.5,
    category: "frutas",
    badge: "bestseller",
    description: "Una mezcla de manzana al vacío para poder degustar nuevos sabores del huerto orbital.",
    extendedDescription: "Una combinación de manzanas seleccionadas y liofilizadas al vacío para ofrecerte una textura ligera, crujiente e increíble. Conserva el sabor original de la fruta con cero añadidos.",
    imagePath: "/Multimedia (2).jfif", // 📌 Pon tu imagen en public/images/manzana-espacial.png
    tags: [
      { label: "Proteína", icon: "flame" },
      { label: "Antioxidante", icon: "shield" },
    ],
    planetHue: "coral",
    moonHue: "mist",
  },
  {
    id: "mango-estelar",
    name: "Mango Estelar",
    price: 3.5,
    category: "frutas",
    description: "Tiras de mango orgánico con un toque de chile espacial. El snack perfecto para recargar energía.",
    extendedDescription: "Mango con chile una combinación clásica, con un ligero toque picante. Liofilizamos gajos de mango premium para crear tu snack favorito. ¡Sabor estelar con solo abrir el empaque!",
    imagePath: "/Multimedia (3).jfif", // 📌 Pon tu imagen en public/images/mango-estelar.png
    tags: [
      { label: "Energía", icon: "zap" },
      { label: "Metabolismo", icon: "flame" },
    ],
    planetHue: "gold",
    moonHue: "coral",
  },
  {
    id: "almendras-andromeda",
    name: "Almendras de Andrómeda",
    price: 3.5,
    category: "mezclas",
    description: "Almendras tostadas con sal marina recolectada de lunas lejanas. Pura textura crujiente.",
    extendedDescription: "Almendras perfectamente tostadas con un toque ideal de sal marina refinada. Un snack repleto de nutrientes y con una textura increíble, perfecto para cualquier momento del día.",
    imagePath: "/Multimedia (1).jfif", // 📌 Pon tu imagen en public/images/almendras-andromeda.png
    tags: [
      { label: "Grasas Saludables", icon: "droplet" },
      { label: "Magnesio", icon: "sparkles" },
    ],
    planetHue: "coral",
    moonHue: "gold",
  },
   {
    id: "mango-estelar",
    name: "Mango Estelar",
    price: 3.5,
    category: "frutas",
    description: "Tiras de mango orgánico con un toque de chile espacial. El snack perfecto para recargar energía.",
    extendedDescription: "Mango con chile una combinación clásica, con un ligero toque picante. Liofilizamos gajos de mango premium para crear tu snack favorito. ¡Sabor estelar con solo abrir el empaque!",
    imagePath: "/Multimedia (3).jfif", // 📌 Pon tu imagen en public/images/mango-estelar.png
    tags: [
      { label: "Energía", icon: "zap" },
      { label: "Metabolismo", icon: "flame" },
    ],
    planetHue: "gold",
    moonHue: "coral",
  },
  {
    id: "almendras-andromeda",
    name: "Almendras de Andrómeda",
    price: 3.5,
    category: "mezclas",
    description: "Almendras tostadas con sal marina recolectada de lunas lejanas. Pura textura crujiente.",
    extendedDescription: "Almendras perfectamente tostadas con un toque ideal de sal marina refinada. Un snack repleto de nutrientes y con una textura increíble, perfecto para cualquier momento del día.",
    imagePath: "/Multimedia (1).jfif", 
    tags: [
      { label: "Grasas Saludables", icon: "droplet" },
      { label: "Magnesio", icon: "sparkles" },
    ],
    planetHue: "coral",
    moonHue: "gold",
  },
  
];