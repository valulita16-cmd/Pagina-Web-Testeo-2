import { recipesBatch1 } from './recipes_batch1';
import { recipesBatch2 } from './recipes_batch2';
import { recipesBatch3 } from './recipes_batch3';
import { recipesBatch4 } from './recipes_batch4';
import { recipesBatch5 } from './recipes_batch5';
import { recipesBatch6 } from './recipes_batch6';
import { recipesBatch7 } from './recipes_batch7';
import { recipesBatch8 } from './recipes_batch8';
import { recipesBatch9 } from './recipes_batch9';
import { recipesBatch10 } from './recipes_batch10';
import { recipesBatch11 } from './recipes_batch11';
import { recipesBatch12 } from './recipes_batch12';
import { recipesBatch13 } from './recipes_batch13';
import { recipesBatch14 } from './recipes_batch14';
import { recipesBatch15 } from './recipes_batch15';
import { recipesBatch16 } from './recipes_batch16';

export interface Recipe {
  id: string | number;
  title: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  difficulty?: string;
  time?: string;
  calories?: string;
  image?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  nutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  tips?: string[];
}

export interface Category {
  name: string;
  image: string;
}

export const categories: Category[] = [
  { name: "Panes, galletas y bizcochos", image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=800&q=80" },
  { name: "Pastas y otros amasados", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80" },
  { name: "Pizzas, tartas y empanadas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" },
  { name: "Facturas y productos de panificación", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80" },
  { name: "Tortas y budines", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80" },
  { name: "Entrantes, tapas y bocadillos", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&q=80" },
  { name: "Salsas y sopas", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80" },
  { name: "Patatas y arroces", image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80" },
  { name: "Carnes", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80" },
  { name: "Pescados", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80" },
  { name: "Huevos y verduras", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80" },
  { name: "Postres y repostería", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80" },
  { name: "Masas y Premezclas", image: "http://eliteproteinkitchen.com/wp-content/uploads/2026/03/ChatGPT-Image-17-mar-2026-01_18_59-p.m.png" },
  { name: "Panes sin gluten y sin lactosa", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&q=80" }
];

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Bizcochitos de grasa con queso",
    category: "Panes, galletas y bizcochos",
    ingredients: [
      "250 g de mezcla de tres harinas (2 ½ tazas)",
      "150 cc de agua (¾ taza)",
      "10 g de levadura o polvo leudante (1 cucharada sopera)",
      "30 g de queso rallado (3 cucharadas soperas)",
      "100 g de grasa",
      "1 pizca de sal fina"
    ],
    instructions: [
      "Colocar en un bol la harina con la levadura deshecha o el polvo leudante.",
      "Hacer un hueco en el centro y agregar el agua, la sal y el queso.",
      "Incorporar la grasa previamente entibiada y amasar hasta formar una masa lisa.",
      "Dejar descansar 20 minutos bien tapada.",
      "Estirar con palote logrando una masa fina (3 o 4 mm de espesor).",
      "Cortar con cortapastas o molde para galletitas.",
      "Colocar en placa, pinchando cada bizcocho con un tenedor.",
      "Si se usa levadura para la masa, dejar descansar antes de llevar al horno.",
      "Hornear de 15 a 20 minutos o hasta apenas dorar a temperatura moderada."
    ],
    difficulty: "baja",
    time: "35'",
    calories: "460 kcal / 100g",
      nutrition: {
                calories: "330 kcal",
                protein: "14g",
                carbs: "45g",
                fat: "9g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "2",
    title: "Bizcochitos de quinoa",
    category: "Panes, galletas y bizcochos",
    ingredients: [
      "200 g de mezcla de tres harinas (2 tazas)",
      "100 g de quinoa arrollada (1 ¼ taza)",
      "50 g de margarina",
      "10 g de polvo leudante (1 cucharada sopera)",
      "5 g de sal fina (1 cucharadita tipo té)",
      "2 huevos"
    ],
    instructions: [
      "Cernir los ingredientes secos y colocarlos en un bol.",
      "Hacer un hueco en el centro y agregar la margarina y los huevos.",
      "Formar un bollo, estirar y cortar la masa utilizando moldes circulares y cuadrados.",
      "Hornear en placa enmantecada de 15 a 20 minutos a temperatura moderada."
    ],
    difficulty: "baja",
    time: "35'",
    calories: "346 kcal / 100g",
      nutrition: {
                calories: "356 kcal",
                protein: "2g",
                carbs: "73g",
                fat: "20g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "3",
    title: "Masa para canelones",
    category: "Pastas y otros amasados",
    ingredients: [
      "Masa: 350 cc de leche fluida (1 ¾ tazas)",
      "300 g de mezcla de tres harinas (3 tazas)",
      "30 cc de aceite (3 cucharadas soperas)",
      "10 g de polvo leudante (1 cucharada sopera)",
      "5 g de sal fina (1 cucharadita tipo té)",
      "2 huevos",
      "Relleno: 600 g de acelga cocida y picada (3 tazas)",
      "150 g de ricota",
      "100 g de cebolla rallada (½ taza)",
      "30 g de queso rallado (3 cucharadas soperas)",
      "20 cc de aceite (2 cucharadas soperas)",
      "5 g de sal fina (1 cucharadita tipo té)",
      "1 huevo",
      "Ajo y perejil fresco a gusto"
    ],
    instructions: [
      "Masa. Cernir, en un bol, la harina con el polvo leudante y la sal.",
      "Agregar el aceite y los huevos.",
      "Luego incorporar la leche y mezclar enérgicamente haciendo círculos de adentro hacia fuera.",
      "Mezclar con batidora y dejar descansar 30 minutos en heladera, antes de formar los panqueques.",
      "Untar con margarina la panquequera y cocinar a fuego mínimo.",
      "Relleno. Picar la cebolla y el ajo, condimentar y rehogar en aceite.",
      "Incorporar el resto de los ingredientes y cocinar durante unos minutos.",
      "Dejar enfriar antes de rellenar los panqueques.",
      "Cubrir con salsa y queso rallado. Gratinar en horno moderado durante 10 minutos."
    ],
    difficulty: "media",
    time: "1h 15'",
    calories: "235 kcal / 100g",
      nutrition: {
                calories: "355 kcal",
                protein: "14g",
                carbs: "76g",
                fat: "7g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "4",
    title: "Bocadillo caliente de jamón serrano y queso",
    category: "Entrantes, tapas y bocadillos",
    ingredients: [
      "2 rebanadas de pan de molde sin gluten",
      "jamón serrano",
      "queso manchego viejo",
      "aceite de oliva"
    ],
    instructions: [
      "Conectar la sandwichera.",
      "Poner unas gotas de aceite en las rebanadas de pan de molde sin gluten.",
      "Colocar el jamón serrano en una de las rebanadas de pan de molde, a continuación el queso manchego y encima otras lonchas de jamón serrano, para terminar con la otra rebanada de pan de molde.",
      "Colocar en la sandwichera y servir una vez que esté dorado."
    ],
      nutrition: {
                calories: "260 kcal",
                protein: "26g",
                carbs: "21g",
                fat: "5g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "5",
    title: "Salmorejo",
    category: "Salsas y sopas",
    ingredients: [
      "1 diente de ajo grande",
      "½ kilogramo de tomates muy rojos y maduros",
      "1 cucharadita de sal",
      "100 gr. de miga de pan sin gluten de un día para otro, (o 100 gr. de manzana)",
      "1 cucharada de vinagre",
      "75 gr. de aceite de oliva",
      "1 huevo duro",
      "50 gr. de jamón serrano"
    ],
    instructions: [
      "Lavar y secar los tomates, cortarlos en trozos pequeños. Cortar el pan y poner en agua.",
      "Colocar en el vaso de la batidora el ajo pelado, los tomates troceados, la sal y triturar todo.",
      "Añadir el pan que habremos escurrido con las manos, (o la manzana troceada), y el vinagre.",
      "Triturar sin detener hasta que se hayan licuado todos los ingredientes.",
      "A continuación, conectar de nuevo la batidora y echar poco a poco el aceite a través del cubilete de esta.",
      "Pasar por el chino y reservar en la nevera hasta la hora de servir.",
      "Adornar con el jamón serrano y el huevo duro picados, y un chorrito de aceite de oliva. Servir muy frío."
    ],
      nutrition: {
                calories: "478 kcal",
                protein: "14g",
                carbs: "57g",
                fat: "20g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "6",
    title: "Arroz tres delicias",
    category: "Patatas y arroces",
    ingredients: [
      "100 gr. de arroz",
      "1 zanahoria",
      "50 gr. de guisantes",
      "50 gr. de pechuga de pavo o pollo",
      "1 huevo",
      "agua",
      "aceite de oliva",
      "sal"
    ],
    instructions: [
      "Cuece el arroz durante 20 minutos en agua y sal.",
      "Pela y corta la zanahoria en dados pequeños. Cuece los guisantes y las zanahorias.",
      "Hacer una tortilla y cortar en trozos pequeños.",
      "Saltea la pechuga de pavo y córtala también en trozos pequeños.",
      "Mezclar todos los ingredientes y saltear en una sartén.",
      "Podemos acompañarlo con una salsa agridulce al gusto.",
      "Las tres delicias (tres guarniciones) son: verduras, jamón o pollo y tortilla francesa. Esta preparación, aunque parezca elemental, es verdaderamente deliciosa."
    ],
      nutrition: {
                calories: "507 kcal",
                protein: "26g",
                carbs: "26g",
                fat: "7g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "7",
    title: "Masa para tarta",
    category: "Pizzas, tartas y empanadas",
    ingredients: [
      "Masa: 300 g de mezcla de tres harinas (3 tazas)",
      "50 g de leche en polvo (½ taza)",
      "50 cc de aceite (¼ taza)",
      "10 g de polvo leudante (1 cucharada sopera)",
      "5 g de sal fina (1 cucharadita tipo té)",
      "2 huevos",
      "Relleno: 300 g de zapallitos cortados en gajos",
      "100 g de cebolla picada (1 taza)",
      "30 g de morrón picado (¼ taza)",
      "20 cc de aceite (2 cucharadas soperas)",
      "1 huevo cocido",
      "1 huevo crudo",
      "Orégano, pimienta y sal a gusto"
    ],
    instructions: [
      "Masa. Tamizar los ingredientes secos en un bol. Incorporar los huevos y el aceite.",
      "Formar la masa. Estirar finita y colocar en tartera de 24 cm de diámetro enmantecada.",
      "Rellenar a gusto y cubrir con la otra tapa. Llevar a horno moderado durante 20 a 25 minutos o hasta dorar.",
      "Relleno. Saltear la cebolla, el morrón y los condimentos en aceite.",
      "Blanquear los zapallitos cortados en gajos y mezclar todos los ingredientes en un bol.",
      "Agregar el huevo picado y ligar con huevo crudo.",
      "Rellenar la masa y decorar con trozos de queso. Tapar y cocinar."
    ],
    difficulty: "media",
    time: "45'",
    calories: "375 kcal / 100g",
      nutrition: {
                calories: "426 kcal",
                protein: "12g",
                carbs: "47g",
                fat: "21g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "8",
    title: "Alfajores de maicena",
    category: "Facturas y productos de panificación",
    ingredients: [
      "650 g de dulce de leche (3 ¼ tazas)",
      "250 g de almidón de maíz (2 ½ tazas)",
      "250 g de harina de arroz (2 ½ tazas)",
      "150 g de azúcar (¾ taza)",
      "150 g de margarina",
      "10 g de polvo leudante (1 cucharada sopera)",
      "2 huevos",
      "Coco rallado",
      "Esencias a gusto"
    ],
    instructions: [
      "Mezclar el azúcar con la margarina.",
      "Agregar esencia de vainilla y los huevos, de a uno, batiendo constantemente.",
      "Incorporar las harinas cernidas junto con el polvo leudante y formar la masa.",
      "Dejar descansar 10 minutos.",
      "Estirar finita y cortar las tapitas.",
      "Cocinar en horno moderado durante 25 minutos o hasta comprobar la cocción.",
      "Armar los alfajores y pasarlos por coco rallado. Servir a gusto."
    ],
    difficulty: "baja",
    time: "1h 30'",
    calories: "368 kcal / 100g",
      nutrition: {
                calories: "533 kcal",
                protein: "12g",
                carbs: "49g",
                fat: "18g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "9",
    title: "Budín clásico",
    category: "Tortas y budines",
    ingredients: [
      "150 g de azúcar (¾ taza)",
      "150 g de manteca",
      "100 g de almidón de maíz (1 taza)",
      "100 g de fécula de mandioca (1 taza)",
      "50 g de harina de arroz (½ taza)",
      "50 g de leche en polvo (½ taza)",
      "10 g de polvo leudante (1 cucharada sopera)",
      "4 yemas",
      "4 claras",
      "1 pizca de sal",
      "Esencia de vainilla y ralladura de limón a gusto"
    ],
    instructions: [
      "Batir la manteca con el azúcar. Agregar de a una las yemas, batiendo. Perfumar.",
      "Cernir los ingredientes secos y volcar sobre la preparación.",
      "Por último, batir las claras a nieve e incorporar con movimientos envolventes.",
      "Colocar en molde de budín ingles, completando hasta la mitad.",
      "Llevar a horno caliente 40 minutos. Comprobar cocción y desmoldar en frío."
    ],
    difficulty: "baja",
    time: "1 hora",
    calories: "401 kcal / 100g",
      nutrition: {
                calories: "309 kcal",
                protein: "27g",
                carbs: "21g",
                fat: "22g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "10",
    title: "Albóndigas de verdura",
    category: "Huevos y verduras",
    ingredients: [
      "3 patatas",
      "3 zanahorias",
      "200 gr. de judías verdes",
      "200 gr. de guisantes",
      "100 gr. de arroz",
      "harina de arroz",
      "½ pastilla de caldo sin gluten",
      "agua",
      "aceite de oliva",
      "sal"
    ],
    instructions: [
      "Limpia y trocea 1 patata, 1 zanahoria, algunas judías verdes y cuécelas en una olla o cazuela con agua, sal y un chorrito de aceite durante 20 ó 25 minutos. Tritura con la batidora hasta conseguir una crema y resérvala.",
      "Aparte, en otra olla, limpia y trocea las zanahorias, el resto de las patatas y las judías verdes. Cuécelas junto con los guisantes y el arroz en agua con un poco de aceite, la ½ pastilla de caldo, y sal, aproximadamente de 20 a 25 minutos. Escurrir las verduras, pasarlas por el pasapurés y hacer un puré espeso.",
      "Dar forma a las albóndigas, pasarlas por harina de arroz y freír en abundante aceite de oliva no demasiado caliente. Dejar escurrir sobre papel de cocina absorbente.",
      "Sírvelas acompañada de la crema."
    ],
      nutrition: {
                calories: "272 kcal",
                protein: "12g",
                carbs: "44g",
                fat: "14g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "11",
    title: "Caballa con fideos",
    category: "Pescados",
    ingredients: [
      "50 gr. de fideos sin gluten por persona",
      "2 ó 3 caballas según tamaño",
      "½ pimiento verde y rojo",
      "½ cebolla",
      "1 tomate pequeño",
      "1 ajo",
      "laurel",
      "aceite de oliva",
      "agua",
      "pimienta",
      "1 vasito de vino blanco",
      "sal"
    ],
    instructions: [
      "Vaciamos las caballas, le quitamos la cabeza y la cortamos en dos filetes, quitándoles la espina central o le pedimos al pescadero que lo haga por nosotros.",
      "Con la cabeza y espinas elaboramos un caldo que reservaremos. Se lavan los filetes de caballa, se secan con papel de cocina y salpimentamos, la pasamos por el perol con aceite caliente hasta que tomen un bonito color y reservamos.",
      "En el mismo aceite o un poco más, se pone la cebolla picada, y cuando esté transparente se añaden el ajo y el pimiento verde y rojo todo muy picado, a continuación el tomate y pochamos todo junto.",
      "Cuando esté, añadimos el laurel, unos granitos de pimienta y el vino blanco, y una vez que se consuma el alcohol, ponemos el caldo que teníamos reservado y lo dejamos hacer unos minutos.",
      "Añadimos las caballas y pasados unos 5 minutos incorporamos los fideos de arroz que dejaremos que se hagan otros 4 ó 5 minutos según la indicación del fabricante y listo."
    ],
      nutrition: {
                calories: "471 kcal",
                protein: "36g",
                carbs: "29g",
                fat: "18g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  {
    id: "12",
    title: "Carrillera de cerdo",
    category: "Carnes",
    ingredients: [
      "750 gr. de carrillera ibérica",
      "1 ó 2 cebollas",
      "3 dientes de ajo",
      "½ pimiento rojo de asar",
      "laurel",
      "romero",
      "orégano",
      "tomillo",
      "1 vasito de vino blanco",
      "pimienta molida",
      "aceite de oliva",
      "agua",
      "sal",
      "patatas"
    ],
    instructions: [
      "Se prepara un refrito con la cebolla picada muy fina, los ajos, y el pimiento rojo en tiras.",
      "Cuando esté hecho el refrito se añade la carne y se dora un poco.",
      "A continuación ponemos el vino y una vez que se consuma el alcohol añadimos el agua junto con las especias (laurel, romero, tomillo, orégano) y salpimentamos.",
      "Lo hacemos en la olla rápida de 20 a 25 minutos hasta que esté tierno.",
      "Una vez acabado, rectificamos de sal, se añaden las patatas medio fritas y se deja hacer todo junto a fuego lento unos minutos más."
    ],
      nutrition: {
                calories: "389 kcal",
                protein: "41g",
                carbs: "15g",
                fat: "12g"
              },
      tips: [
                "Asegúrate de medir bien los ingredientes para un mejor resultado.",
                "Puedes conservar esta preparación en un recipiente hermético."
              ]
},
  ...recipesBatch1,
  ...recipesBatch2,
  ...recipesBatch3,
  ...recipesBatch4,
  ...recipesBatch5,
  ...recipesBatch6,
  ...recipesBatch7,
  ...recipesBatch8,
  ...recipesBatch9,
  ...recipesBatch10,
  ...recipesBatch11,
  ...recipesBatch12,
  ...recipesBatch13,
  ...recipesBatch14,
  ...recipesBatch15,
  ...recipesBatch16
];
