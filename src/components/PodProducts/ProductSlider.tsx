import React from 'react';
import Marquee from 'react-fast-marquee';
import NextImage from 'next/image';
import ProductListing from './ProductListing';
import { Product, Store, User } from '@prisma/client';

interface Productswithstore extends Product {
    store : Store
  }
  interface ProductReelProps {
    user?: User
    products : Productswithstore[]
  
  }
const ProductSlider = (props: ProductReelProps) => {
const { user , products } = props


  return (

    <Marquee>
    <div className="flex my-4">
      {products.map((product, index) => (
        <div className='w-72 mx-8' key={index}>
        <ProductListing
          user={user!}
          key={`product-${index}`}
          product={product}
          index={index + 1}
        />
        </div>
      ))}
    </div>
  </Marquee>
  );
};

export default ProductSlider;
