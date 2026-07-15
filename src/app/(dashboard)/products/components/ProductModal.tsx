"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { productService, Product } from "@/lib/api/productService";
import { categoryService, Category } from "@/lib/api/categoryService";
import Swal from "sweetalert2";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productToEdit?: Product | null;
}

export default function ProductModal({ open, setOpen, productToEdit }: ProductModalProps) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_id: "",
    description: "",
    short_description: "",
    purchase_price: "",
    selling_price: "",
    offer_price: "",
    price: "",
    stock: "0",
    size_names: "",
  });
  
  const [images, setImages] = useState({
    image_1: null as File | null,
    image_2: null as File | null,
    image_3: null as File | null,
    image_4: null as File | null,
    image_5: null as File | null,
  });

  const [previewImages, setPreviewImages] = useState({
    image_1: "",
    image_2: "",
    image_3: "",
    image_4: "",
    image_5: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { data: rawCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  // Flatten categories for dropdown
  const flattenCategories = (cats: Category[], depth = 0): (Category & { depth: number })[] => {
    let result: (Category & { depth: number })[] = [];
    cats.forEach(c => {
      result.push({ ...c, depth });
      if (c.subcategories && c.subcategories.length > 0) {
        result = result.concat(flattenCategories(c.subcategories, depth + 1));
      }
    });
    return result;
  };

  const categories = flattenCategories(rawCategories);

  useEffect(() => {
    if (open) {
      if (productToEdit) {
        setFormData({
          name: productToEdit.name || "",
          slug: productToEdit.slug || "",
          category_id: productToEdit.category_id?.toString() || "",
          description: productToEdit.description || "",
          short_description: productToEdit.short_description || "",
          purchase_price: productToEdit.purchase_price || "",
          selling_price: productToEdit.selling_price || "",
          offer_price: productToEdit.offer_price || "",
          price: productToEdit.price || "",
          stock: productToEdit.stock?.toString() || "0",
          size_names: productToEdit.sizes ? productToEdit.sizes.map(s => s.name).join(", ") : "",
        });
        setPreviewImages({
          image_1: productToEdit.image_1 || "",
          image_2: productToEdit.image_2 || "",
          image_3: productToEdit.image_3 || "",
          image_4: productToEdit.image_4 || "",
          image_5: productToEdit.image_5 || "",
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          category_id: "",
          description: "",
          short_description: "",
          purchase_price: "",
          selling_price: "",
          offer_price: "",
          price: "",
          stock: "0",
          size_names: "",
        });
        setPreviewImages({ image_1: "", image_2: "", image_3: "", image_4: "", image_5: "" });
      }
      setImages({ image_1: null, image_2: null, image_3: null, image_4: null, image_5: null });
      setErrors({});
    }
  }, [open, productToEdit]);

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire({
        title: "Success!",
        text: "Product created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setOpen(false);
    },
    onError: handleError
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => productService.update(productToEdit!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire({
        title: "Success!",
        text: "Product updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setOpen(false);
    },
    onError: handleError
  });

  function handleError(error: any) {
    const data = error?.response?.data;
    if (data && typeof data === 'object') {
      if (data.detail) {
        setErrors({ general: [data.detail] });
      } else {
        setErrors(data);
      }
    } else {
      setErrors({ general: ["Something went wrong. Please try again."] });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "name" && !productToEdit) {
      const slugValue = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, name: value, slug: slugValue }));
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        // Auto-calculate final price
        if (name === "selling_price" || name === "offer_price") {
          const offer = parseFloat(newData.offer_price);
          const selling = parseFloat(newData.selling_price);
          
          if (!isNaN(offer) && offer > 0 && !isNaN(selling)) {
            newData.price = (selling - offer).toString();
          } else if (!isNaN(selling)) {
            newData.price = selling.toString();
          } else {
            newData.price = "";
          }
        }
        
        return newData;
      });
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: "image_1" | "image_2" | "image_3" | "image_4" | "image_5") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImages(prev => ({ ...prev, [field]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    if (images.image_1) data.append("image_1", images.image_1);
    if (images.image_2) data.append("image_2", images.image_2);
    if (images.image_3) data.append("image_3", images.image_3);
    if (images.image_4) data.append("image_4", images.image_4);
    if (images.image_5) data.append("image_5", images.image_5);

    if (productToEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (!open) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isPending && setOpen(false)}></div>
      
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button 
            onClick={() => !isPending && setOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm">
                {errors.general[0]}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Basic Info */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
                    required
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.slug ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
                    required
                  />
                  {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.category_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.depth > 0 ? "— ".repeat(c.depth) : ""}{c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.short_description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
                  />
                  {errors.short_description && <p className="text-xs text-red-500 mt-1">{errors.short_description[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>}
                </div>
              </div>

              {/* Right Column: Pricing & Images */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="purchase_price"
                      value={formData.purchase_price}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.purchase_price && <p className="text-xs text-red-500 mt-1">{errors.purchase_price[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    {errors.selling_price && <p className="text-xs text-red-500 mt-1">{errors.selling_price[0]}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="offer_price"
                      value={formData.offer_price}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.offer_price && <p className="text-xs text-red-500 mt-1">{errors.offer_price[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (Final)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 focus:ring-0 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sizes (comma separated)</label>
                    <input
                      type="text"
                      name="size_names"
                      placeholder="e.g. S, M, L, XL"
                      value={formData.size_names}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.size_names && <p className="text-xs text-red-500 mt-1">{errors.size_names[0]}</p>}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Product Images</label>
                  <div className="flex flex-wrap gap-4">
                    {(["image_1", "image_2", "image_3", "image_4", "image_5"] as const).map((field, idx) => (
                      <div key={field} className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors overflow-hidden group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, field)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {previewImages[field] ? (
                          <Image src={previewImages[field]} alt={`Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary-500">
                            <Upload className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-medium">Img {idx + 1}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.image_1 && <p className="text-xs text-red-500 mt-1">Image 1: {errors.image_1[0]}</p>}
                  {errors.image_2 && <p className="text-xs text-red-500 mt-1">Image 2: {errors.image_2[0]}</p>}
                  {errors.image_3 && <p className="text-xs text-red-500 mt-1">Image 3: {errors.image_3[0]}</p>}
                  {errors.image_4 && <p className="text-xs text-red-500 mt-1">Image 4: {errors.image_4[0]}</p>}
                  {errors.image_5 && <p className="text-xs text-red-500 mt-1">Image 5: {errors.image_5[0]}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0 bg-gray-50/50 dark:bg-gray-900">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {productToEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
