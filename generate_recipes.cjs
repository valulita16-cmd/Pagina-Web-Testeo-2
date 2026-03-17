const fs = require('fs');

const titles = [
  "Pan de \"Cacho\"", "Pan para hamburguesas", "Pancitos saborizados", "Tortas fritas",
  "Fideos", "Lasagna", "Ñoquis de papa", "Pionono salado", "Ravioles de verdura",
  "Masa para tarta", "Masa para tarteletas", "Mayotarta", "Pizza", "Pizza con residuos de soja",
  "Pizza de pencas de acelga", "Tapas para empanadas", "Facturas", "Francesitas", "Lemon pie",
  "Madalenas", "Medialunas dulces", "Rogel", "Tarta de ricota", "Tiramisú", "Tortas negras",
  "Bizcochuelo", "Pan con pasas de uva", "Pan dulce", "Pan madrileño", "Pastafrola",
  "Pionono dulce", "Rosca navideña", "Vainillas", "Budín clásico", "Budín Inglés",
  "Tarta crocante de manzana", "Torta de algarroba", "Torta helada de dulce de leche",
  "Torta marmolada", "Torta Marta", "Torta para el mate", "Torta trocitos", "Bay biscuit",
  "Galletitas de arroz", "Galletitas de miel", "Galletitas surtidas", "Masitas vienesas",
  "Polvorones", "Rosquitas", "Scones", "Bocaditos de salchicha", "Cogollos con salmorejo",
  "Pan con jamón y salmorejo", "Pan con tomate y jamón", "Sándwich de pollo",
  "Sándwich de jamón de york y queso", "Serranito", "Tarta vegetal", "Tostada de jamón y queso",
  "Tostadas con pringá", "Tostadas de jamón de pato con setas", "Pastillas de caldo",
  "Salsa bechamel", "Salsa de tomate", "Sopa de picadillo", "Sopa de pollo con fideos",
  "Lasaña de puré de patatas", "Patatas ali-oli", "Patatas rellenas", "Boca-pizza", "Churros",
  "Empanada", "Empanada de dátiles, beicon, jamón de york y queso", "Empanadillas",
  "Espaguetis con nata", "Fusillis con carne", "Gnocchis", "Harinas sin gluten", "Lasaña",
  "Macarrones con tomate", "Pan de leche", "Pan de máquina", "Pan de molde", "Pan rallado",
  "Pan rústico", "Pasta fresca", "Pasta rellena", "Picos y regañás", "Pizza de pan",
  "Albóndigas de verdura", "Berenjenas rellenas", "Cardillos con huevos", "Emparedados de berenjenas",
  "Fritura de berenjenas", "Garbanzos fritos con huevos y patatas", "Guiso de habas",
  "Habitas fritas con jamón y huevo", "Huevos con pan y ajos fritos", "Huevos de codorniz con jamón",
  "Huevos pasados por agua con tostadas", "Pastel de berenjenas", "Pencas de acelgas rebozadas",
  "Revuelto de patatas con jamón", "Tortilla de berenjenas, jamón de york y queso",
  "Tortilla de champiñones con jamón", "Cazón en adobo", "Merluza con gambas y chirlas",
  "Pescado a la sal", "Pescaito frito", "Albóndigas", "Albóndigas de patata y carne",
  "Carrillera de cerdo", "Croquetas", "Croquetas de jamón", "Croquetas de pollo",
  "Escalopes de ternera", "Fiambre de lomo de cerdo", "Fiambre de pollo y jamón de york",
  "Flamenquines", "Medallones de carne picada", "Pechugas de pollo empanadas", "Pechugas Villeroy",
  "Pechugas al horno con bechamel", "Pechugas rellenas", "Pollo al vino moscatel con pasas",
  "San Jacobo", "Arroz con leche", "Bizcocho de chocolate", "Bizcocho de naranja",
  "Bizcocho tita Juana Mª", "Bizcocho de flan", "Brazo de gitano con nata", "Buñuelos al horno rellenos",
  "Caramelo líquido", "Castañas guisadas", "Crema de leche, cacao y avellanas", "Crepes dulces",
  "Dulce de membrillo", "Flan de chocolate", "Gachas", "Galletas", "Galletas de chocolate",
  "Galletas fritas", "Galletitas saladas", "Gofres", "Huevos nevados", "Leche frita",
  "Magdalenas", "Mantecados", "Merengue", "Natillas", "Pan de datiles con nueces",
  "Pastel de batata", "Peras al vino tinto", "Pestiños", "Piñonate", "Plancha de bizcocho",
  "Pudding de pan sin gluten", "Roscón de reyes", "Tarta de queso", "Tarta de Santiago",
  "Tarta de sémola de arroz", "Tarta de tres chocolates", "Tocino de cielo", "Torrijas",
  "Tortas de aceite", "Tortas de polvorón", "Pan de molde sin gluten", "Galletas de avena sin gluten",
  "Bizcocho de yogur", "Magdalenas caseras", "Crepes salados", "Masa de pizza fina",
  "Pan de ajo", "Tostadas francesas", "Gofres salados", "Panqueques de manzana",
  "Muffins de arándanos", "Brownie de chocolate", "Tarta de zanahoria", "Cheesecake",
  "Tiramisú en vaso", "Mousse de limón", "Panna cotta", "Helado casero", "Sorbete de fresa",
  "Batido de frutas", "Smoothie de plátano", "Zumo detox", "Limonada casera", "Té helado"
];

const categories = [
  "Panes, galletas y bizcochos",
  "Pastas y otros amasados",
  "Pizzas, tartas y empanadas",
  "Facturas y productos de panificación",
  "Tortas y budines",
  "Entrantes, tapas y bocadillos",
  "Salsas y sopas",
  "Patatas y arroces",
  "Carnes",
  "Pescados",
  "Huevos y verduras",
  "Postres y repostería"
];

let recipes = [];
let idCounter = 13;

for (let i = 0; i < 188; i++) {
  const title = titles[i % titles.length];
  const category = categories[i % categories.length];
  
  recipes.push({
    id: idCounter.toString(),
    title: title + (i >= titles.length ? " " + i : ''),
    category: category,
    ingredients: [
      "Ingrediente sin gluten 1",
      "Ingrediente sin gluten 2",
      "Ingrediente sin gluten 3"
    ],
    instructions: [
      "Preparar los ingredientes.",
      "Mezclar todo en un bol.",
      "Cocinar según las indicaciones.",
      "Servir y disfrutar."
    ],
    difficulty: i % 3 === 0 ? "baja" : (i % 3 === 1 ? "media" : "alta"),
    time: (20 + (i % 40)) + "'",
    calories: (200 + (i % 300)) + " kcal"
  });
  idCounter++;
}

const fileContent = "import { Recipe } from './recipes';\n\nexport const recipesBatch2: Recipe[] = " + JSON.stringify(recipes, null, 2) + ";\n";

fs.writeFileSync('src/data/recipes_batch2.ts', fileContent);
console.log('Generated 188 recipes in src/data/recipes_batch2.ts');
