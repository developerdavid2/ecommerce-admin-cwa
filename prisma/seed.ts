import { PrismaClient } from "@prisma/client";

const prismadb = new PrismaClient();

const DEMO_USER_ID = "user_3JSDFgd2MOxiCXeETyAODw0Bp7I";

const storesToSeed = [
  {
    name: "ShopX Demo Store",
    brand: "fashion",
    billboards: [
      { label: "Summer Collection", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80" },
      { label: "Winter Essentials", imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1920&q=80" },
    ],
    categories: [
      { name: "T-Shirts", billboard: 0 },
      { name: "Shorts", billboard: 0 },
      { name: "Jackets", billboard: 1 },
      { name: "Sweaters", billboard: 1 },
      { name: "Accessories", billboard: 0 },
    ],
    sizes: [
      { name: "Extra Small", value: "XS" },
      { name: "Small", value: "S" },
      { name: "Medium", value: "M" },
      { name: "Large", value: "L" },
      { name: "Extra Large", value: "XL" },
      { name: "XX Large", value: "XXL" },
    ],
    colours: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Navy Blue", value: "#1B2A4A" },
      { name: "Red", value: "#DC2626" },
      { name: "Forest Green", value: "#166534" },
      { name: "Grey", value: "#6B7280" },
      { name: "Beige", value: "#D2B48C" },
    ],
    products: [
      { name: "Classic Cotton T-Shirt", price: 29.99, category: "T-Shirts", size: "M", colour: "Black", isFeatured: true, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"] },
      { name: "Premium Graphic Tee", price: 34.99, category: "T-Shirts", size: "L", colour: "White", isFeatured: true, images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"] },
      { name: "Casual Denim Shorts", price: 39.99, category: "Shorts", size: "L", colour: "Navy Blue", isFeatured: true, images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80", "https://images.unsplash.com/photo-1506619216599-9d16d63e5554?w=800&q=80"] },
      { name: "Lightweight Summer Shorts", price: 24.99, category: "Shorts", size: "M", colour: "Beige", isFeatured: false, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"] },
      { name: "Waterproof Winter Jacket", price: 129.99, category: "Jackets", size: "L", colour: "Forest Green", isFeatured: true, images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80", "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"] },
      { name: "Puffer Jacket", price: 149.99, category: "Jackets", size: "M", colour: "Grey", isFeatured: false, images: ["https://images.unsplash.com/photo-1520975910216-d2a55f8e7c83?w=800&q=80"] },
      { name: "Merino Wool Sweater", price: 89.99, category: "Sweaters", size: "M", colour: "Navy Blue", isFeatured: true, images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", "https://images.unsplash.com/photo-1620799140118-09881b1b89b0?w=800&q=80"] },
      { name: "Cashmere Blend Sweater", price: 119.99, category: "Sweaters", size: "L", colour: "Beige", isFeatured: false, images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"] },
      { name: "Leather Belt", price: 24.99, category: "Accessories", size: "M", colour: "Black", isFeatured: false, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"] },
      { name: "Stainless Steel Watch", price: 199.99, category: "Accessories", size: "XS", colour: "Black", isFeatured: true, images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80", "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"] },
    ],
  },
  {
    name: "TechGear Electronics",
    brand: "electronics",
    billboards: [
      { label: "Latest Gadgets", imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&q=80" },
      { label: "Audio & Accessories", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=80" },
    ],
    categories: [
      { name: "Smartphones", billboard: 0 },
      { name: "Laptops", billboard: 0 },
      { name: "Headphones", billboard: 1 },
      { name: "Smart Watches", billboard: 1 },
      { name: "Accessories", billboard: 0 },
    ],
    sizes: [
      { name: "64GB", value: "64GB" },
      { name: "128GB", value: "128GB" },
      { name: "256GB", value: "256GB" },
      { name: "512GB", value: "512GB" },
      { name: "1TB", value: "1TB" },
      { name: "One Size", value: "OS" },
    ],
    colours: [
      { name: "Space Black", value: "#1D1D1F" },
      { name: "Silver", value: "#C0C0C0" },
      { name: "Graphite", value: "#4B4B4D" },
      { name: "Gold", value: "#FFD700" },
      { name: "Pacific Blue", value: "#007AFF" },
      { name: "Midnight Green", value: "#006B5B" },
      { name: "Rose Gold", value: "#E8B4B8" },
    ],
    products: [
      { name: "iPhone 15 Pro", price: 999.99, category: "Smartphones", size: "256GB", colour: "Space Black", isFeatured: true, images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"] },
      { name: "Samsung Galaxy S24 Ultra", price: 1199.99, category: "Smartphones", size: "512GB", colour: "Graphite", isFeatured: true, images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"] },
      { name: "MacBook Air M3", price: 1299.99, category: "Laptops", size: "512GB", colour: "Silver", isFeatured: true, images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"] },
      { name: "Dell XPS 15", price: 1499.99, category: "Laptops", size: "1TB", colour: "Graphite", isFeatured: false, images: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80"] },
      { name: "Sony WH-1000XM5", price: 349.99, category: "Headphones", size: "OS", colour: "Space Black", isFeatured: true, images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"] },
      { name: "AirPods Pro 2", price: 249.99, category: "Headphones", size: "OS", colour: "Silver", isFeatured: true, images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80"] },
      { name: "Apple Watch Ultra 2", price: 799.99, category: "Smart Watches", size: "OS", colour: "Space Black", isFeatured: true, images: ["https://images.unsplash.com/photo-1546868871-7041f2a55712?w=800&q=80"] },
      { name: "Samsung Galaxy Watch 6", price: 329.99, category: "Smart Watches", size: "OS", colour: "Graphite", isFeatured: false, images: ["https://images.unsplash.com/photo-1579586337278-3f436f4f0f3b?w=800&q=80"] },
      { name: "USB-C Hub 7-in-1", price: 49.99, category: "Accessories", size: "OS", colour: "Space Black", isFeatured: false, images: ["https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80"] },
      { name: "Wireless Charger Pad", price: 29.99, category: "Accessories", size: "OS", colour: "Silver", isFeatured: false, images: ["https://images.unsplash.com/photo-1586952518488-7d1b8b8e3b2e?w=800&q=80"] },
    ],
  },
  {
    name: "HomeStyle Furniture",
    brand: "home",
    billboards: [
      { label: "Living Room Essentials", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80" },
      { label: "Bedroom Comfort", imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8fdf1f9?w=1920&q=80" },
    ],
    categories: [
      { name: "Sofas", billboard: 0 },
      { name: "Tables", billboard: 0 },
      { name: "Beds", billboard: 1 },
      { name: "Mattresses", billboard: 1 },
      { name: "Decor", billboard: 0 },
    ],
    sizes: [
      { name: "Single", value: "SINGLE" },
      { name: "Double", value: "DOUBLE" },
      { name: "Queen", value: "QUEEN" },
      { name: "King", value: "KING" },
      { name: "Small", value: "SMALL" },
      { name: "Large", value: "LARGE" },
    ],
    colours: [
      { name: "Charcoal", value: "#36454F" },
      { name: "Cream", value: "#FFFDD0" },
      { name: "Walnut", value: "#773F1A" },
      { name: "Oak", value: "#D2B48C" },
      { name: "White", value: "#FFFFFF" },
      { name: "Grey", value: "#808080" },
      { name: "Navy", value: "#000080" },
    ],
    products: [
      { name: "Modern Sectional Sofa", price: 1899.99, category: "Sofas", size: "LARGE", colour: "Charcoal", isFeatured: true, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"] },
      { name: "Mid-Century Loveseat", price: 899.99, category: "Sofas", size: "SMALL", colour: "Cream", isFeatured: false, images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"] },
      { name: "Solid Oak Dining Table", price: 1299.99, category: "Tables", size: "LARGE", colour: "Oak", isFeatured: true, images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80"] },
      { name: "Glass Coffee Table", price: 449.99, category: "Tables", size: "SMALL", colour: "White", isFeatured: false, images: ["https://images.unsplash.com/photo-1532372320572-cda25653a264?w=800&q=80"] },
      { name: "King Platform Bed Frame", price: 1199.99, category: "Beds", size: "KING", colour: "Walnut", isFeatured: true, images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80", "https://images.unsplash.com/photo-1583847268964-b28dc8fdf1f9?w=800&q=80"] },
      { name: "Queen Upholstered Bed", price: 899.99, category: "Beds", size: "QUEEN", colour: "Grey", isFeatured: false, images: ["https://images.unsplash.com/photo-1540518418918-8a3322f4e4f6?w=800&q=80"] },
      { name: "Memory Foam Mattress King", price: 799.99, category: "Mattresses", size: "KING", colour: "White", isFeatured: true, images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"] },
      { name: "Hybrid Mattress Queen", price: 649.99, category: "Mattresses", size: "QUEEN", colour: "White", isFeatured: false, images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"] },
      { name: "Ceramic Vase Set", price: 79.99, category: "Decor", size: "SMALL", colour: "Cream", isFeatured: false, images: ["https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80"] },
      { name: "Floor Lamp Modern", price: 149.99, category: "Decor", size: "SMALL", colour: "Charcoal", isFeatured: true, images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"] },
    ],
  },
];

async function seedStore(storeConfig: typeof storesToSeed[0]) {
  const existingStore = await prismadb.store.findFirst({
    where: { name: storeConfig.name, userId: DEMO_USER_ID },
  });

  if (existingStore) {
    console.log(`⏭️  Store "${storeConfig.name}" already exists, skipping...`);
    return existingStore;
  }

  const store = await prismadb.store.create({
    data: { name: storeConfig.name, userId: DEMO_USER_ID },
  });

  console.log(`✅ Created store: ${store.name} (${store.id})`);

  const billboards = await Promise.all(
    storeConfig.billboards.map(b =>
      prismadb.billboard.create({ data: { storeId: store.id, ...b } })
    )
  );
  console.log(`✅ Created ${billboards.length} billboards`);

  const categories = await Promise.all(
    storeConfig.categories.map(c =>
      prismadb.category.create({
        data: { storeId: store.id, billboardId: billboards[c.billboard].id, name: c.name },
      })
    )
  );
  console.log(`✅ Created ${categories.length} categories`);

  const sizes = await Promise.all(
    storeConfig.sizes.map(s =>
      prismadb.size.create({ data: { storeId: store.id, ...s } })
    )
  );
  console.log(`✅ Created ${sizes.length} sizes`);

  const colours = await Promise.all(
    storeConfig.colours.map(c =>
      prismadb.colour.create({ data: { storeId: store.id, ...c } })
    )
  );
  console.log(`✅ Created ${colours.length} colours`);

  for (const productData of storeConfig.products) {
    const category = categories.find(c => c.name === productData.category)!;
    const size = sizes.find(s => s.value === productData.size)!;
    const colour = colours.find(c => c.name === productData.colour)!;

    const product = await prismadb.product.create({
      data: {
        storeId: store.id,
        categoryId: category.id,
        sizeId: size.id,
        colourId: colour.id,
        name: productData.name,
        price: productData.price,
        isFeatured: productData.isFeatured,
        images: { create: productData.images.map(url => ({ url })) },
      },
    });
    console.log(`   ✅ ${product.name} - $${product.price}`);
  }

  return store;
}

async function main() {
  console.log("🌱 Starting multi-store seed...\n");

  for (const storeConfig of storesToSeed) {
    console.log(`📦 Seeding: ${storeConfig.name} (${storeConfig.brand})`);
    await seedStore(storeConfig);
    console.log("");
  }

  console.log("🎉 All stores seeded successfully!");
  const allStores = await prismadb.store.findMany({ where: { userId: DEMO_USER_ID } });
  for (const s of allStores) {
    console.log(`   🔗 /stores/${s.id} — ${s.name}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismadb.$disconnect();
  });