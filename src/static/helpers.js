// import React from 'react';

export function formatPrice(cents) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

export function capitalizeFirstLetter(string) {
  if (typeof string !== 'string') return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
