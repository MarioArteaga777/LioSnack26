import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const CodesForm = () => {
    const schema = yup.object().shape({
        code: yup.string().required('El código es requerido'),
        description: yup.string().required('La descripción es requerida'),
        type: yup.string().required('El tipo de código es requerido'),
    });

    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('code')} placeholder="Letras del código" />
            <p>{errors.code?.message}</p>
            <input type="text" {...register('description')} placeholder="Descripción del código" />
            <p>{errors.description?.message}</p>
            <input type="text" {...register('type')} placeholder="Tipo de código" />
            <p>{errors.type?.message}</p>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default CodesForm;