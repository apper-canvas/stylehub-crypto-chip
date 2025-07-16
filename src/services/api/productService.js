import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getAll: async () => {
    await delay(300);
    return [...productsData];
  },

  getById: async (id) => {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  getByCategory: async (category) => {
    await delay(250);
    return productsData.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  },

  search: async (query) => {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  },

  filter: async (filters) => {
    await delay(200);
    let filteredProducts = [...productsData];

    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.brands && filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filters.brands.includes(p.brand)
      );
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filters.sizes.some(size => p.sizes.includes(size))
      );
    }

    if (filters.colors && filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filters.colors.some(color => p.colors.includes(color))
      );
    }

    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(p => {
        const price = p.discountPrice || p.price;
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }

    return filteredProducts;
  },

  getRelated: async (productId, limit = 4) => {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(productId));
    if (!product) return [];

    const related = productsData.filter(p => 
      p.Id !== parseInt(productId) && 
      (p.category === product.category || p.brand === product.brand)
    );

    return related.slice(0, limit);
  },

  getTrending: async (limit = 8) => {
    await delay(250);
    return productsData
      .filter(p => p.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  getNewArrivals: async (limit = 8) => {
    await delay(250);
    return productsData
      .sort((a, b) => b.Id - a.Id)
      .slice(0, limit);
  }
};