import React from 'react'; // Importa o React para utilizar JSX e criar o componente.
import CompLetras from '../letras/Letras.jsx'; // Importa o componente CompLetras, que representa cada letra arrastável.
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'; // Importa as funcionalidades de ordenação do @dnd-kit, que permitem tornar os itens ordenáveis.
import style from './VogaisGrid.module.css'; // Importa o arquivo de estilos CSS específico para este componente.

function VogaisGrid({ Letras }) {
    // Função para converter um número em uma letra do alfabeto (0 = A, 1 = B, etc.).
    const numeroToletra = (numero) => String.fromCharCode(65 + numero); // Converte um número em sua letra correspondente (baseado na tabela ASCII, 'A' começa em 65).

    return (
        <>
            <div className={style.compJogo}>
                {/* SortableContext envolve os itens que precisam ser ordenados e permite que eles sejam arrastáveis */}
                <SortableContext items={Letras} strategy={rectSortingStrategy}>
                    {/* O componente SortableContext recebe uma lista de itens (Letras) e uma estratégia de ordenação */}

                    {/* Mapeia cada letra para o componente CompLetras, que será responsável por torná-las arrastáveis */}
                    {Letras.map((letra) => (
                        <CompLetras
                            key={letra.id} // Chave única para cada item da lista (necessária para performance e consistência do React).
                            id={letra.id} // Passa o id único de cada letra.
                            value={letra.value} // Passa o valor numérico da letra (ex: 1 para 'A', 2 para 'B').
                        />
                    ))}
                </SortableContext>
            </div>
        </>
    );
}

export default VogaisGrid; // Exporta o componente para ser usado em outras partes da aplicação.
