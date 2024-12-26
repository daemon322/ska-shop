/*import random from 'random';
import { format } from 'date-fns';
const brands = ["Adidas", "Puma", "Reebok", "Nike"];
const categories = ["Running", "Casual", "Basketball", "Soccer", "Training"];
const descriptions = [
  "Ligero y cómodo para uso diario.",
  "Diseñado para los mejores rendimientos en el deporte.",
  "Calzado versátil para entrenamientos y competiciones.",
  "Perfecto para fanáticos del deporte que buscan calidad.",
  "Estilo moderno combinado con funcionalidad deportiva.",
];
const tags = ["Black Friday", "Nuevo", "Oferta Especial", "Edición Limitada", "Temporada 2024"];
const base_price = [50, 70, 90, 110, 130];

const products = [];

for (let i = 1; i <= 100; i++) {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const tag = tags[Math.floor(Math.random() * tags.length)];
  const original_price = base_price[Math.floor(Math.random() * base_price.length)];
  const discount = Math.floor(Math.random() * 21) + 10; // 10 to 30
  const price = parseFloat((original_price * (1 - discount / 100)).toFixed(2));
  const initial_stock = Math.floor(Math.random() * 151) + 50; // 50 to 200
  const stock = Math.floor(Math.random() * (initial_stock + 1));
  const offer_end_time = format(new Date(Date.now() + random.int(1, 30) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd HH:mm:ss');
  const soles = `${price * 4} soles`; // Aproximando la conversión de moneda

  products.push({
    id: i,
    name: `${brand} ${category} Shoe ${i}`,
    category,
    description,
    originalPrice: original_price,
    price,
    discount,
    initialStock: initial_stock,
    stock,
    offerEndTime: offer_end_time,
    tag,
    soles,
    image: "", // Placeholder para las rutas de las imágenes
  });
}

export default products;
*/