import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const SalesForm = () => {

    const schema = yup.object().shape({
        billDate: yup.date().required("La fecha es requerida"),
        customer: yup.string().required("El cliente es requerido"),
        skuDescription: yup.string().required(),
        invoicedAmount: yup.number().required(),
        invoicedBonus: yup.number(),
        pendingBalance: yup.number(),
        expirationDatePayment: yup.date().required(),
        daysExpired: yup.number(),
        status: yup.string().required(),
        paymentMethod: yup.string().required(),
        personInCharge: yup.string().required(),
        notes: yup.string()
    })
}