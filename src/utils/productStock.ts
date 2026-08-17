import { Product } from "@/lib/api/productService";

export function getSizeStock(product: Product, sizeName: string): number {
  if (product.size_stocks && product.size_stocks.length > 0) {
    const found = product.size_stocks.find(
      (ss) => ss.size_name.trim().toUpperCase() === sizeName.trim().toUpperCase()
    );
    if (found) return Math.max(0, found.stock);
    if (product.size_stocks.every((ss) => ss.stock === 0) && product.stock > 0) {
      return Math.max(0, product.stock);
    }
    return 0;
  }
  return Math.max(0, product.stock || 0);
}

export function getProductAvailableStock(
  product: Product,
  sizeName?: string | null
): number {
  const totalStock = typeof product.stock === "number" ? product.stock : parseInt(String(product.stock || "0"), 10);

  if (sizeName && product.size_stocks && product.size_stocks.length > 0) {
    return getSizeStock(product, sizeName);
  }

  if (product.size_stocks && product.size_stocks.length > 0) {
    const sumSizeStock = product.size_stocks.reduce((acc, ss) => acc + (ss.stock || 0), 0);
    if (sumSizeStock > 0) return sumSizeStock;
  }

  return Math.max(0, totalStock || 0);
}

export function getFirstAvailableSize(product: Product): string | undefined {
  if (!product.sizes || product.sizes.length === 0) return undefined;

  if (product.size_stocks && product.size_stocks.length > 0) {
    const available = product.size_stocks.find((ss) => ss.stock > 0);
    if (available) return available.size_name;
  }

  return product.sizes[0]?.name;
}
