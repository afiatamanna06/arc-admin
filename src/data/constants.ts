export const categories = [
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
] as const;

export const subcategories: Record<(typeof categories)[number], string[]> = {
  Tops: ["T-Shirt", "Shirt", "Hoodie", "Sweater"],
  Bottoms: ["Jeans", "Pants", "Shorts", "Skirt"],
  Outerwear: ["Jacket", "Coat", "Blazer"],
  Accessories: ["Hat", "Scarf", "Belt", "Bag"],
};

export const fabrics = [
  "Cotton",
  "Polyester",
  "Wool",
  "Linen",
  "Silk",
  "Denim",
  "Blend",
];
export const colors = [
  "Black",
  "White",
  "Gray",
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "Purple",
  "Pink",
  "Brown",
];
export const genders = ["Unisex", "Men", "Women", "Kids"];
export const fits = ["Slim", "Regular", "Relaxed", "Oversized"];
export const seasons = ["All-season", "Spring", "Summer", "Autumn", "Winter"];
export const styles = [
  "Casual",
  "Formal",
  "Sport",
  "Streetwear",
  "Vintage",
  "Minimal",
];
export const statuses = ["draft", "published", "archived"] as const;
export const priorities = ["low", "medium", "high"] as const;
export const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
