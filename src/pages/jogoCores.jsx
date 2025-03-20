<<<<<<< HEAD
import React from 'react';
import { Card } from '../components/jogoCores/Card'
import classes from '../assets/styles/jogoCores.module.css'
import { Random } from '../hooks/Random';
import { animals, colors } from '../components/jogoCores/Data.jsx'

export default function JogoNumeros() {
    // Quantidade de elementos a serem gerados
    // const elements: number[] = Populate(10);
    // const listElements = elements.map(element =>
    //     <NumberBox key={elements.indexOf(element)} value={element} />
    // );

    const data = Random(animals);
    const strings = data.map(element =>
        <p><b>{element.name}</b> gosta do {element.color}.</p>
    )

    const listElements = data.map(element =>
        <Card key={data.indexOf(element)} value={element} />
    )

    return (
        <>
            <div className={classes.container}>
                <h1>Jogo das Cores</h1>
                <p>Arraste as cores para seus respectivos animais.</p>
                <div className={classes.infoArea}>
                    <div className={classes.info}>
                        {strings}
                        <p>Coloque a cor favorita em cada bichinho.</p>
                    </div>
                    <div className={classes.colorArea}>
                        <div className={classes.square}></div>
                        <div className={classes.square}></div>
                        <div className={classes.square}></div>
                        <div className={classes.square}></div>
                        <div className={classes.square}></div>
                        <div className={classes.square}></div>
                    </div>
                </div>

                <div className={classes.cardGrid}>
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
            <div className="btnJogos">
                <a href="/jogo-vogais"><button href>Proximo Jogo</button></a>
            </div>
        </>
    );
}

// import React from 'react';
// import { Card } from '../components/jogoCores/Card.jsx'
// import { Colors } from '../components/jogoCores/ColorSqr.jsx'
// import { Descriptions } from '../components/jogoCores/Description.jsx';
// import { DndContext } from '@dnd-kit/core'
// import classes from '../assets/styles/jogoCores.module.css'

// export default function JogoNumeros() {
//     return (
//         <div className={classes.wrapper}>
//             <section className={classes.container}>
//                 <h1 className={classes.heading}>Jogo das Cores</h1>
//                 <p className={classes.paragraph}>Arraste as cores para seus respectivos animais.</p>
//                 <div className={classes.infoArea}>
//                     <div className={classes.info}>
//                         <Descriptions />
//                         <p className={classes.paragraph}>Coloque a cor favorita em cada bichinho.</p>
//                     </div>
//                     <div className={classes.colorArea}>
//                         <Colors />
//                     </div>
//                 </div>
//                 <div className={classes.cardGrid}>
//                     <Card />
//                 </div>
//             </section>
//         </div>
//     );
// }
=======
import React, { useState } from 'react';
import { animalsData, colorsData, stringsData } from '../components/jogoCores/Data.jsx'
import {
    DndContext,
    useDroppable,
    useSensor,
    useSensors,
    PointerSensor,
    closestCorners,
    useDraggable
} from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities";
import { random } from "../hooks/utils.js"
import classes from '../assets/styles/jogoCores.module.css'

export default function JogoNumeros() {
    const [colors, setColors] = useState(
        Array.from({ length: colorsData.length }, (_, index) => ({
            id: index + 1,
            value: colorsData[index].code,
        }))
    );

    const [droppedColors, setDroppedColors] = useState([]);

    const sensors = useSensors(useSensor(PointerSensor));

    const DroppableArea = (props) => {
        const { setNodeRef } = useDroppable({
            id: props.id,
        });

        return (
            <div key={props.id} id={props.id} ref={setNodeRef} className={classes.dropArea}>
                {props.children}
            </div>
        )
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        if (over.id === active.id) {
            const colorToDrop = colors.find(color => color.id === active.id);

            setDroppedColors(prev => [...prev, colorToDrop]);
            setColors(prevColors => prevColors.filter(color => color.id !== colorToDrop.id));
        }
    }

    const Image = ({ animal }) => {
        return (
            <img
                src={animal.img}
                width={100}
                alt={animal.name}
            />
        )
    }

    const Card = ({ animal }) => {
        return (
            <div className={classes.card}>
                <Image animal={animal} />
                <DroppableArea key={animal.id + 1} id={animal.id + 1}>
                    {droppedColors.find(color => color.id === animal.id) ? (
                        <ColorBox key={colorsData.id} id={colorsData.id} color={colorsData.code} />
                    ) : (null)}
                </DroppableArea>
            </div>
        )
    }

    const Cards = () => {
        const cards = animalsData.map(element =>
            <Card key={element.id} animal={element} />
        );

        return cards;
    }

    const ColorBox = ({ id, color }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });

        const staticStyles = {
            willChange: 'transform',
        };

        const dynamicStyles = {
            transform: CSS.Translate.toString(transform),
            transition,
        };

        return (
            <div
                className={classes.square}
                id={id}
                ref={setNodeRef}
                style={{
                    backgroundColor: color,
                    ...staticStyles,
                    ...dynamicStyles
                }}
                {...attributes}
                {...listeners}
            >
            </div>
        )
    }

    const Colors = () => {
        const colorsArr = colors.map(element =>
            <ColorBox key={element.id} id={element.id} color={element.value} />
        );

        return colorsArr;
    }

    const Description = ({ animal, color, string }) => {
        return <p className={classes.paragraph}>{animal.article} <b>{animal.name}</b> {string.body} {color.name}</p>
    }

    const Descriptions = () => {
        const descriptions = animalsData.map(element => {
            const color = colorsData.at(element.id);
            const string = stringsData.at(element.id) || stringsData.at(random(stringsData.length));

            return (
                <Description
                    key={element.id}
                    animal={element}
                    color={color}
                    string={string}
                />
            )
        })

        return descriptions
    }

    return (
        <>
            <div className={classes.gameBody}>
                <div className={classes.game}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}
                    >
                        <div className={classes.infoArea}>
                            <h1 className={classes.heading}>Jogo das Cores</h1>
                            <p className={classes.paragraph}>Arraste as cores para seus respectivos animais.</p>
                            <div className={classes.info}>
                                <Descriptions />
                                <p className={classes.paragraph}>Coloque a cor favorita em cada bichinho.</p>
                            </div>
                            <div className={classes.colorArea}>
                                <Colors />
                            </div>
                        </div>
                        <div className={classes.cardGrid}>
                            <Cards />
                        </div>
                    </DndContext>
                </div>
            </div>
        </>
    );
}
>>>>>>> 5e1fc147aff1122ed12ac63c44b1b939ce9711d7
