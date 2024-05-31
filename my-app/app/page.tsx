"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";

interface Product {
  name: string;
  id: number;
  price: string;
  image: string;
  type: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7012/api/Product');
        setProducts(response.data);
      } catch (error) {
        console.error('There was an error fetching the products!', error);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7012/api/Product/${id}`);
      setProducts(prevProducts => prevProducts.filter(product => product.id!== id));
    } catch (error) {
      console.error('There was an error deleting the product!', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || product.type === selectedType;
    console.log(matchesName)
    console.log(matchesType)
    return matchesName && matchesType;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>
      <div className="search-bar flex flex-wrap justify-center mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 pl-10 text-sm text-gray-700"
        />
      <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      </div>
        <label htmlFor="productType" className="block mb-2 text-sm font-bold text-gray-700">
          Product Type
        </label>
        <select
          id="productType"
          value={selectedType}
          onChange={handleTypeChange}
          className="block w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 pl-10 text-sm text-gray-700"
        >
          <option value="">Todos</option>
          <option value="Zapatos">Zapatos</option>
          <option value="Faldas">Faldas</option>
          <option value="Sudaderas">Sudaderas</option>
          <option value="Pantalones">Pantalones</option>
          <option value="Camisetas">Camisetas</option>
        </select>
      </div>
      <div className="products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product bg-dark rounded-lg shadow-md p-4">
            <img
              className="w-full h-64 object-cover rounded-lg"
              src={product.image}
              alt={product.name}
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>ID: {product.id}</p>
            <p>Precio: {product.price}</p>
            <p>Tipo: {product.type}</p>
            <button
              onClick={() => deleteProduct(product.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;