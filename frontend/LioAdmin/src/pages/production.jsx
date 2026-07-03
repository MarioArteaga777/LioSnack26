import { Plus } from "lucide-react";
import { useState } from "react";

import Button from "../components/Button";

import ProductionCard from "../components/Cards/ProductionCard";
import ProductionDetailsModal from "../components/ProductionDetailsModal";

import ProductionForm from "../forms/ProductionForm";

import confirmToast from "../utils/confirmToast";

import useFetchProduction from "../hooks/Production/useFetchProduction";
import useProductionActions from "../hooks/Production/useProductionActions";
const Production = () => {

    const {
        productions,
        getProductions,
        loading
    } = useFetchProduction();

    const {
        createProduction,
        updateProduction,
        deleteProduction
    } = useProductionActions();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingProduction, setEditingProduction] = useState(null);

    const [detailsProduction, setDetailsProduction] = useState(null);

    // Abre el formulario en modo creación
    const openCreateForm = () => {
        setEditingProduction(null);
        setIsModalOpen(true);
    };

    // Abre el formulario precargado con la producción a editar
    const openUpdateForm = (production) => {
        setEditingProduction(production);
        setIsModalOpen(true);
    };

    // Cierra el formulario y limpia la producción en edición
    const closeForm = () => {
        setEditingProduction(null);
        setIsModalOpen(false);
    };

    // Decide si crea un registro nuevo o actualiza el que se está editando
    const handleSaveProduction = async (data) => {

        if (editingProduction) {

            const result = await updateProduction(
                editingProduction._id,
                data
            );

            if (result.ok) {
                await getProductions();
                closeForm();
            }

        } else {

            const result = await createProduction(data);

            if (result.ok) {
                await getProductions();
                closeForm();
            }

        }

    };

    // Pide confirmación y elimina el registro de producción seleccionado
    const handleDelete = async (production) => {

        const confirmed = await confirmToast(
            `¿Eliminar la producción del SKU "${production.SKU}"?`
        );

        if (!confirmed) return;

        const result = await deleteProduction(production._id);

        if (result.ok) {
            await getProductions();
        }

    };

    // Mientras se obtienen los registros, se muestra un mensaje de carga
    if (loading) {

        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-white text-lg">
                    Cargando Producción...
                </p>
            </div>
        );

    }

    return (

        <div>

            <ProductionForm

                id="production-form"

                isOpen={isModalOpen}

                onClose={closeForm}

                onSubmit={handleSaveProduction}

                initialData={editingProduction}

            />

            <ProductionDetailsModal

                id="production-details"

                production={detailsProduction}

                onClose={() => setDetailsProduction(null)}

            />

            {/* Header */}

            <div className="mb-20 flex items-center justify-between">

                <h1 className="mt-6 mb-12 text-3xl font-semibold text-white">

                    Producción

                </h1>

                <Button

                    text="Nueva Producción"

                    icon={Plus}

                    onClick={openCreateForm}

                />

            </div>

            <div className="flex justify-center">

                {/* Listado de registros de producción en formato grilla */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

                    {productions.length > 0 ? (

                        productions.map((production) => (

                            <ProductionCard

                                key={production._id}

                                sku={production.SKU}

                                horaInicio={production.HoraInicio}

                                horaFinalizacion={production.HoraFinalizacion}

                                bolsasEsperadas={production.BolsasEsperadas}

                                bolsasObtenidas={production.BolsasObtenidas}

                                kg={production.KG}

                                estado={production.Estado}

                                onUpdate={() =>
                                    openUpdateForm(production)
                                }

                                onDetails={() =>
                                    setDetailsProduction(production)
                                }

                                onDelete={() =>
                                    handleDelete(production)
                                }

                            />

                        ))

                    ) : (

                        <div className="col-span-full">

                            <p className="text-center text-white text-lg">

                                No existen registros de producción.

                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default Production;