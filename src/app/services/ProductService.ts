import { IProduct, IProductCreate } from '@/app/interfaces/IProduct';
import { httpClient } from '@/app/services/httpClient';

export class ProductService {
  static async getProducts(): Promise<IProduct[]> {
    const { data } = await httpClient.get<IProduct[]>('/product');

    return data;
  }

  static async getSearchProduct(search: string): Promise<IProduct[]> {
    const { data } = await httpClient.get<IProduct[]>(
      `product/search/${search}`,
    );

    return data;
  }

  static async createProduct(product: IProductCreate): Promise<void> {
    const formData = new FormData();
    formData.append('name', product.name || '');
    formData.append('description', product.description || '');
    formData.append('price', product.price?.toString() || '');
    formData.append('stock', product.stock?.toString() || '');
    formData.append('lowStock', product.lowStock.toString());
    formData.append('categoryId', product.categoryId || '');

    if (product.image) {
      formData.append('image', product.image);
    }

    await httpClient.post('/product/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async editProduct(
    productId: string,
    product: IProductCreate,
  ): Promise<void> {
    const formData = new FormData();

    formData.append('name', product.name || '');
    formData.append('description', product.description || '');
    formData.append('price', product.price.toString() || '');
    formData.append('stock', product.stock.toString());
    formData.append('lowStock', product.lowStock.toString());
    formData.append('categoryId', product.categoryId || '');

    if (product.image) {
      formData.append('image', product.image);
    }

    await httpClient.put(`product/edit/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async deleteProduct(productId: string): Promise<void> {
    await httpClient.delete(`product/${productId}`);
  }
}
