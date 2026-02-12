import React from 'react';
import './LoadingSkeleton.css';

export const FoodItemSkeleton = () => (
  <div className="food-item-skeleton">
    <div className="skeleton skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-price"></div>
    </div>
  </div>
);

export const OrderSkeleton = () => (
  <div className="order-skeleton">
    <div className="skeleton-row">
      <div className="skeleton skeleton-icon"></div>
      <div className="skeleton skeleton-line"></div>
      <div className="skeleton skeleton-line-short"></div>
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3, Component = FoodItemSkeleton }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <Component key={i} />
    ))}
  </>
);
