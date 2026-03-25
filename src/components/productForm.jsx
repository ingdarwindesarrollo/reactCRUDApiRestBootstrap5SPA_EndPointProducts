import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../api/product.api';

function ProductForm({onSaved, selectedProduct, onCancelEdit}) {
    const [form, setForm] = useState({
        name: '',
        price: ''
    });
    useEffect(() => {
        if (selectedProduct){
            setForm({name: selectedProduct.name, price: selectedProduct.price});
        }else{
            setForm({name:'', price: ''});
        }
    }, [selectedProduct]);

    function handleChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        if(selectedProduct){
            await updateProduct(selectedProduct.id, form);
        }else{
            await createProduct(form);        
        }
        setForm({name:'', price: ''});
        onSaved();
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className='row g-3'>
                <div className='col-md-5'>
                    <input 
                    className='form-control' 
                    name='name' 
                    placeholder='Nombre del producto' 
                    value={form.name} 
                    onChange={handleChange} 
                    required />
                </div>

                <div className='col-md-4'>
                    <input 
                    className='form-control' 
                    name='price' 
                    placeholder='Precio del producto' 
                    value={form.price} 
                    onChange={handleChange} 
                    required />
                </div>

                <div className='col-md-3 d-flex gap-2'>
                    <button
                    type='submit'
                    className={`btn ${selectedProduct ? 'btn-warning': 'btn-success'} w-100`}>
                        {selectedProduct ? 'Actualizar': 'Crear'}
                    </button>
                    {selectedProduct && (
                        <button
                        type='button'
                    className='btn btn-secondary w-100'
                    onClick={onCancelEdit}>Cancelar</button>)}
                </div>
            </div>
        </form>
    );
}

export default ProductForm;