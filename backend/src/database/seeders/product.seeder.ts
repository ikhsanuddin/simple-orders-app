import { ProductRepository } from '../mongo/repositories/product.repository';

export class ProductSeeder {
  constructor(private readonly productRepository: ProductRepository) {}

  async seed(): Promise<void> {
    console.log('\n📦 Seeding Products...\n');

    const products = await this.getProductsData();

    for (const productData of products) {
      await this.seedProduct(productData);
    }

    await this.printSummary();
  }

  private getProductsData() {
    return [
      {
        name: 'Margherita Pizza',
        description:
          'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
        price: 65000,
        stock: 50,
        available: true,
      },
      {
        name: 'Pepperoni Pizza',
        description:
          'Traditional pizza topped with pepperoni slices and mozzarella cheese',
        price: 75000,
        stock: 45,
        available: true,
      },
      {
        name: 'BBQ Chicken Pizza',
        description:
          'BBQ sauce base with grilled chicken, onions, and bell peppers',
        price: 85000,
        stock: 40,
        available: true,
      },
      {
        name: 'Vegetarian Supreme',
        description:
          'Loaded with mushrooms, bell peppers, onions, olives, and tomatoes',
        price: 70000,
        stock: 35,
        available: true,
      },
      {
        name: 'Meat Lovers Pizza',
        description: 'Beef, sausage, pepperoni, and bacon with extra cheese',
        price: 95000,
        stock: 30,
        available: true,
      },
      {
        name: 'Hawaiian Pizza',
        description: 'Ham and pineapple with mozzarella cheese',
        price: 0,
        stock: 0,
        available: false,
      },
      {
        name: 'Cheese Burst Pizza',
        description: 'Stuffed crust pizza with melted cheese inside the edges',
        price: 90000,
        stock: 25,
        available: true,
      },
      {
        name: 'Spicy Italian Pizza',
        description: 'Hot salami, jalapeños, chili flakes, and spicy sauce',
        price: 80000,
        stock: 38,
        available: true,
      },
      {
        name: 'Seafood Delight',
        description: 'Shrimp, squid, and fish with garlic sauce',
        price: 110000,
        stock: 20,
        available: true,
      },
      {
        name: 'Truffle Mushroom Pizza',
        description:
          'Premium pizza with truffle oil, mixed mushrooms, and parmesan',
        price: 125000,
        stock: 15,
        available: true,
      },
    ];
  }

  private async seedProduct(productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    available: boolean;
  }): Promise<void> {
    const exists = await this.productExists(productData.name);

    if (!exists) {
      await this.productRepository.create(productData);
      console.log(`✓ Created product: ${productData.name}`);
    } else {
      console.log(`⊘ Product already exists: ${productData.name}`);
    }
  }

  private async productExists(name: string): Promise<boolean> {
    const products = await this.productRepository.findAll();
    return products.some((product) => product.name === name);
  }

  private async printSummary(): Promise<void> {
    const allProducts = await this.productRepository.findAll();
    const totalStock = allProducts.reduce(
      (sum, product) => sum + product.stock,
      0,
    );

    console.log('\nProduct Summary:');
    console.log(`  Total Products: ${allProducts.length}`);
    console.log(`  Total Stock: ${totalStock} units`);
  }
}
