import React from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

import Numero from '@/components/jogoNumeros/Numero/Numero.jsx';
import styles from './NumerosGrid.module.css';

function NumerosGrid({ numbers }) {
    // Função para converter um número em uma letra do alfabeto (0 = A, 1 = B, etc.).
    return (
        <>
            <div className={styles.numberDragList}>
                {/* SortableContext permite que os itens dentro dele sejam arrastáveis e ordenáveis */}
                <SortableContext items={numbers} strategy={rectSortingStrategy}>
                    {/* Mapeia cada letra em um componente numbers, que será arrastável */}
                    {numbers.map((number) => (
                        <Numero key={number.id} id={number.id} value={number.value} />
                    ))}
                </SortableContext>
            </div>
        </>
    );
}

export default NumerosGrid;