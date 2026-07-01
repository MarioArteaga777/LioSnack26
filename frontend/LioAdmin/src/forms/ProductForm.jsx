import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const ProductForm = () => {
    const schema = yup.object().shape({
        name: yup.string().required('El nombre es requerido'),
        price: yup.number().required('El precio es requerido'),
        description: yup.string().required('La descripción es requerida'),
        image: yup.string().required('La imagen es requerida'),
    });

    const { register, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('name')} placeholder="Nombre" />
            <input type="number" {...register('price')} placeholder="Precio" />
            <input type="text" {...register('description')} placeholder="Descripción" />
            <input type="text" {...register('image')} placeholder="Imagen" />
            <button type="submit">Guardar</button>
        </form>
    );
};

export default ProductForm;