import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import style from "../scrollButton/ScrollButton.module.css";

const ScrollButton = () => {
    const [canScroll, setCanScroll] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

            const scrollable = scrollHeight > clientHeight;
            const stillCanScrollDown = scrollTop + clientHeight < scrollHeight - 5;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

            setCanScroll(scrollable);
            setCanScrollDown(scrollable && stillCanScrollDown);
            setIsAtBottom(scrollable && atBottom);
        };

        handleScroll(); // Verifica ao montar

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const scrollDown = () => {
        window.scrollBy({ top: 200, behavior: "smooth" });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!canScroll) return null; // Esconde tudo se não tem como rolar

    return (
        <div className={style.btnScroll}>
            {isAtBottom && (
                <button onClick={scrollToTop}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            )}
            {canScrollDown && (
                <button onClick={scrollDown}>
                    <FontAwesomeIcon icon={faArrowDown} />
                </button>
            )}
        </div>
    );
};

export default ScrollButton;
