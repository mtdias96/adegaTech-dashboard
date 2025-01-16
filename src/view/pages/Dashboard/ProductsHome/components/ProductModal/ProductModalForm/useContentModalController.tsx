import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';

import { useCreateProduct } from '@/app/hooks/product/useCreateProduct';
import { useEditProduct } from '@/app/hooks/product/useEditProduct';
import { IProduct } from '@/app/interfaces/IProduct';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const modalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string(),
  categoryId: z.string(),
  image: z.instanceof(File).optional(),
  stock: z.coerce
    .number()
    .int()
    .positive('Estoque deve ser um número positivo'),
  price: z.number().min(1, 'Valor é obrigatório'),
});

type ModalSchema = z.infer<typeof modalSchema>;

export function useContentModalController(editProduct: boolean) {
  const { createProduct, isPending } = useCreateProduct();
  const { edit } = useEditProduct();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<File>();

  const {
    handleSubmit: hookFormHandleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ModalSchema>({
    resolver: zodResolver(modalSchema),
  });

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const image = URL.createObjectURL(file);
        setSelectedImage(image);
        setImageData(acceptedFiles[0]);
      }
    },
  });

  const handleSubmit = hookFormHandleSubmit((data) => {
    const product = {
      ...data,
      price: Number(data.price),
      image: imageData,
    } as IProduct;

    if (!editProduct) {
      createProduct(product);
    }

    if (editProduct) {
      setSelectedImage(null);
      edit(product);
    }

    setSelectedImage(null);
    reset();
  });

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    getValues,
    setValue,
    getRootProps,
    getInputProps,
    isDragActive,
    selectedImage,
    setSelectedImage,
    isPending,
    open,
  };
}
