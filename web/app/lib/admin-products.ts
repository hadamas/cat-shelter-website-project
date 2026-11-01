import { apiUrl } from "./api";
import type { Product } from "./shop";
import { deletePhotos, uploadPhoto } from "./storage";
import type { ApiError } from "./admin-cats";

// Funções usadas pelo modal de cadastro/edição de produtos (só admins).

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  limitedEdition: boolean;
  colors: string[];
  sizes: string[];
  stock: number;
  photos: { url: string; alt: string }[];
};

/** Cadastra (sem id) ou edita (com id) um produto. */
export async function saveProduct(
  token: string,
  input: ProductInput,
  id?: string,
): Promise<{ product?: Product; error?: ApiError }> {
  try {
    const res = await fetch(apiUrl(id ? `/products/${id}` : "/products"), {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
    const body = await res.json().catch(() => ({}));
    return res.ok ? { product: body as Product } : { error: { error: "Não foi possível salvar.", ...body } };
  } catch {
    return { error: { error: "Sem conexão com o servidor. Tente novamente." } };
  }
}

/** Exclui um produto e as fotos dele no Storage. */
export async function deleteProduct(token: string, product: Product): Promise<{ error?: string }> {
  try {
    const res = await fetch(apiUrl(`/products/${product.id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 404) {
      const body = await res.json().catch(() => ({}));
      return { error: body.error ?? "Não foi possível excluir." };
    }
  } catch {
    return { error: "Sem conexão com o servidor. Tente novamente." };
  }
  await deleteProductPhotos(product.photos.map((p) => p.src));
  return {};
}

export const uploadProductPhoto = (file: File) => uploadPhoto("products", file);
export const deleteProductPhotos = (urls: string[]) => deletePhotos("products", urls);
