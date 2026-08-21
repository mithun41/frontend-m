"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { productService, Product } from "@/lib/api/productService";
import { categoryService, Category } from "@/lib/api/categoryService";
import { colorService } from "@/lib/api/colorService";
import Swal from "sweetalert2";
import { X, Upload, Palette } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productToEdit?: Product | null;
}

export default function ProductModal({ open, setOpen, productToEdit }: ProductModalProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
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
    color_names: "",
  });

  const [imageColors, setImageColors] = useState({
    image_1_color: "",
    image_2_color: "",
    image_3_color: "",
    image_4_color: "",
    image_5_color: "",
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

  const { data: availableColors = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: colorService.getAll,
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
          size_names: productToEdit.size_stocks && productToEdit.size_stocks.length > 0
            ? productToEdit.size_stocks.map(ss => `${ss.size_name}:${ss.stock}`).join(", ")
            : productToEdit.sizes ? productToEdit.sizes.map(s => s.name).join(", ") : "",
          color_names: productToEdit.colors && productToEdit.colors.length > 0
            ? productToEdit.colors.map(c => c.name).join(", ")
            : "",
        });
        setImageColors({
          image_1_color: productToEdit.image_1_color?.name || "",
          image_2_color: productToEdit.image_2_color?.name || "",
          image_3_color: productToEdit.image_3_color?.name || "",
          image_4_color: productToEdit.image_4_color?.name || "",
          image_5_color: productToEdit.image_5_color?.name || "",
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
          color_names: "",
        });
        setImageColors({
          image_1_color: "",
          image_2_color: "",
          image_3_color: "",
          image_4_color: "",
          image_5_color: "",
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
      queryClient.invalidateQueries({ queryKey: ["colors"] });
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
      queryClient.invalidateQueries({ queryKey: ["colors"] });
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
    } else if (name === "size_names") {
      setFormData(prev => {
        const newData = { ...prev, size_names: value };
        if (value.includes(":")) {
          let total = 0;
          let hasExplicitStock = false;
          value.split(",").forEach(part => {
            const trimmed = part.trim();
            if (trimmed.includes(":")) {
              const count = parseInt(trimmed.split(":")[1]?.trim() || "0", 10);
              if (!isNaN(count)) {
                total += count;
                hasExplicitStock = true;
              }
            }
          });
          if (hasExplicitStock) {
            newData.stock = total.toString();
          }
        }
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
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

  const handleImageColorChange = (field: keyof typeof imageColors, value: string) => {
    setImageColors(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const uploadedUrls: Record<string, string> = {};
      const uploadTasks: Promise<void>[] = [];

      for (let i = 1; i <= 5; i++) {
        const key = `image_${i}` as keyof typeof images;
        const file = images[key];
        if (file) {
          uploadTasks.push(
            uploadToCloudinary(file).then((url) => {
              uploadedUrls[key] = url;
            })
          );
        }
      }

      await Promise.all(uploadTasks);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value.toString());
        }
      });

      if (!data.has('stock') || formData.stock === "") {
        data.set('stock', '0');
      }

      for (let i = 1; i <= 5; i++) {
        const key = `image_${i}` as keyof typeof images;
        if (uploadedUrls[key]) {
          data.append(key, uploadedUrls[key]);
        }
      }

      for (let i = 1; i <= 5; i++) {
        const colorKey = `image_${i}_color` as keyof typeof imageColors;
        const colorVal = imageColors[colorKey];
        if (colorVal) {
          data.append(`image_${i}_color_name`, colorVal);
        }
      }

      if (productToEdit) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    } catch (err: any) {
      Swal.fire({
        title: "Upload Failed",
        text: err.message || "Failed to upload image to Cloudinary",
        icon: "error"
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => !isPending && setOpen(false)}></div>
      
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button 
            onClick={() => !isPending && setOpen(false)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-xs sm:text-sm">
                {errors.general[0]}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column: Basic Info */}
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {"— ".repeat(c.depth)}{c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    placeholder="Brief highlights of the product..."
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.short_description && <p className="text-xs text-red-500 mt-1">{errors.short_description[0]}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>}
                </div>

                {/* Colors Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-primary-500" />
                    Product Colors (e.g. Black, White, Navy Blue)
                  </label>
                  <input
                    type="text"
                    name="color_names"
                    placeholder="e.g. Black, White, Red, Navy Blue"
                    value={formData.color_names}
                    onChange={handleChange}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    Comma-separated list of colors.
                  </p>
                  {errors.color_names && <p className="text-xs text-red-500 mt-1">{errors.color_names[0]}</p>}
                </div>
              </div>

              {/* Right Column: Pricing, Sizes, Stock, Photo with Colors */}
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="purchase_price"
                      value={formData.purchase_price}
                      onChange={handleChange}
                      className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.purchase_price && <p className="text-xs text-red-500 mt-1">{errors.purchase_price[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleChange}
                      className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    {errors.selling_price && <p className="text-xs text-red-500 mt-1">{errors.selling_price[0]}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="offer_price"
                      value={formData.offer_price}
                      onChange={handleChange}
                      className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.offer_price && <p className="text-xs text-red-500 mt-1">{errors.offer_price[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (Final)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      readOnly
                      className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 focus:ring-0 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock[0]}</p>}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sizes & Stock <span className="text-[10px] text-gray-400 font-normal">(Optional)</span>
                      </label>
                      {formData.size_names && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, size_names: "" }))}
                          className="text-[10px] text-red-500 hover:text-red-700 font-medium"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      name="size_names"
                      placeholder="e.g. S:10, M:20 or S, M, L"
                      value={formData.size_names}
                      onChange={handleChange}
                      className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.size_names && <p className="text-xs text-red-500 mt-1">{errors.size_names[0]}</p>}
                  </div>
                </div>

                {/* Images with Color Tagging - Responsive Grid */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Images & Color Tagging
                  </label>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-2.5">
                    Upload photos and optionally assign color names to each photo.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                    {(["image_1", "image_2", "image_3", "image_4", "image_5"] as const).map((field, idx) => {
                      const colorField = `${field}_color` as keyof typeof imageColors;
                      return (
                        <div key={field} className="flex flex-col gap-1.5">
                          <div className="relative aspect-square w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors overflow-hidden group bg-gray-50 dark:bg-gray-800">
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
                                <Upload className="w-4 h-4 mb-0.5" />
                                <span className="text-[10px] font-medium">Img {idx + 1}</span>
                              </div>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Color..."
                            value={imageColors[colorField]}
                            onChange={(e) => handleImageColorChange(colorField, e.target.value)}
                            list={`color-list-${idx}`}
                            className="w-full text-center px-1.5 py-1 text-[11px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-primary-500"
                          />
                          <datalist id={`color-list-${idx}`}>
                            {availableColors.map(c => (
                              <option key={c.id} value={c.name} />
                            ))}
                          </datalist>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2.5 sm:gap-3 shrink-0 bg-gray-50/50 dark:bg-gray-900">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending || isUploading}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={isPending || isUploading}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {(isPending || isUploading) && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {isUploading ? "Uploading Images..." : productToEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
