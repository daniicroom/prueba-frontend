"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  name: string;
  id: number;
  price: string;
  image: string;
  type: string;
  description: string
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    id: 0,
    price: '',
    image: '',
    type: '',
    description: ''
  });

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
      setShowDetails(false);
      setProducts(prevProducts => prevProducts.filter(product => product.id!== id));
    } catch (error) {
      console.error('There was an error deleting the product!', error);
    }
  };
  
  const updateProduct = async () => {
    console.log(selectedProduct)
    if (selectedProduct) {
      try {
        await axios.put(`https://localhost:7012/api/Product/${selectedProduct.id}`, selectedProduct);
        setShowDetails(false);
        setProducts(prevProducts => prevProducts.map(product => product.id === selectedProduct.id ? selectedProduct : product));
      } catch (error) {
        console.error('There was an error updating the product!', error);
      }
    }
  };
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7012/api/Product', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', id: 0, price: '', image: '', type: '', description: '' });
    } catch (error) {
      console.error('There was an error adding the product!', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

   // Función para cerrar el detalle del producto
   const closeProductDetail = () => {
    setSelectedProduct(null);
    setShowDetails(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, [name]: value });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || product.type === selectedType;
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
        <label htmlFor="productType" className="block mb-2 text-sm font-bold text-gray-700 mr-2">
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
          <option value="Vestidos">Vestidos</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Chaquetas">Chaquetas</option>
        </select>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          {showForm ? 'Cerrar' : 'Agregar Producto'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={addProduct} className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            value={newProduct.name}
            onChange={handleNewProductChange}
            className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="price"
            type="text"
            placeholder="Precio"
            value={newProduct.price}
            onChange={handleNewProductChange}
            className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="image"
            type="text"
            placeholder="URL de la imagen"
            value={newProduct.image}
            onChange={handleNewProductChange}
            className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="type"
            type="text"
            placeholder="Tipo"
            value={newProduct.type}
            onChange={handleNewProductChange}
            className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="description"
            type="text"
            placeholder="Descripción"
            value={newProduct.description}
            onChange={handleNewProductChange}
            className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Agregar
          </button>
        </form>
      )}
      <div className="products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product bg-dark rounded-lg shadow-md p-4">
            <img
              className="w-full h-64 object-cover rounded-lg"
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>ID: {product.id}</p>
            <p>Precio: {product.price}</p>
            <p>Tipo: {product.type}</p>
            <button
              onClick={() => handleProductClick(product)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-black rounded-lg p-8 max-w-lg w-full overflow-auto max-h-screen">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeProductDetail}>
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">Detalles del Producto</h2>
            <div className="mb-4">
              <img className="w-full max-h-64 object-cover rounded-lg" src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <input
              name="name"
              type="text"
              className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
              value={selectedProduct.name}
              onChange={handleInputChange}
            />
            <input
              name="price"
              type="text"
              className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
              value={selectedProduct.price}
              onChange={handleInputChange}
            />
            <input
              name="type"
              type="text"
              className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
              value={selectedProduct.type}
              onChange={handleInputChange}
            />
            <input
              name="description"
              type="text"
              className="text-gray-700 mb-2 w-full p-2 border border-gray-300 rounded"
              value={selectedProduct.description}
              onChange={handleInputChange}
            />
            <button
            onClick={() => deleteProduct(selectedProduct.id)}
            className="bg-red-500 hover
            text-white font-bold py-2 px-4 rounded mr-2"
            >
            Eliminar
            </button>
            <button
            onClick={() => updateProduct()}
            className="bg-blue-500 hover
            text-white font-bold py-2 px-4 rounded"
            >
            Actualizar
            </button>
            </div>
            </div>
            )}
    </div>
  );
};

export default App;