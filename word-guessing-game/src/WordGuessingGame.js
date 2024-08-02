import React, { useState, useEffect } from "react";
import "./WordGuessingGame.css"; // Skapa denna fil för styling

const wordsList = [
    {
        word: "HELLO",
        description: "A common greeting to say hi."
    },
    {
        word: "WORLD",
        description: "The planet we live on, which is full of land and water."
    },
    {
        word: "JAVASCRIPT",
        description: "A popular programming language for building interactive websites and provides behaviour to applications."
    },
    {
        word: "REACT",
        description: "A Javascript library in which we have written this project code"
    },
    {
        word: "PROGRAMMING",
        description: "The process of developing code to assist computers to perform tasks."
    },
    {
        word: "SUPERMARKET",
        description: "It's where you buy food"
    },
    {
        word: "LIBRARY",
        description: "The place where you can borrow books"
    },
    {
        word: "WEEKEND",
        description: "Two days at the end of the week"
    },
    {
        word: "HOSPITAL",
        description: "It's where you go when you are sick"
    }
];

const fetchRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    return wordsList[randomIndex];
};

const WordGuessingGame = () => {
    const [currentWordData, setCurrentWordData] = useState(fetchRandomWord());
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("black");
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [remainingHints, setRemainingHints] = useState(3);
    const [revealWord, setRevealWord] = useState(false);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const [stars, setStars] = useState(0);

    useEffect(() => {
        if (incorrectGuesses >= 3) {
            alert("Game Over! You made too many wrong guesses.");
            resetGame();
        }
    }, [incorrectGuesses]);

    const handleLetterSelect = (letter) => {
        if (!selectedLetters.includes(letter)) {
            setSelectedLetters([...selectedLetters, letter]);
            if (!currentWordData.word.includes(letter)) {
                setIncorrectGuesses(incorrectGuesses + 1);
                setStars(Math.max(0, stars - 1));
            }
        }
    };

    const handleHint = () => {
        if (remainingHints > 0) {
            const hiddenLetterIndex = currentWordData.word
                .split("")
                .findIndex((letter) => !selectedLetters.includes(letter));
            setSelectedLetters([...selectedLetters, currentWordData.word[hiddenLetterIndex]]);
            setRemainingHints(remainingHints - 1);
        }
    };

    const handleRemoveLastLetter = () => {
        setSelectedLetters(selectedLetters.slice(0, -1));
    };

    const renderLetterButtons = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        return Array.from(letters).map((letter, index) => (
            <button
                key={index}
                onClick={() => handleLetterSelect(letter)}
                disabled={selectedLetters.includes(letter)}
                className={`letter-button ${
                    selectedLetters.includes(letter) ? "selected" : ""
                }`}
            >
                {letter}
            </button>
        ));
    };

    const isWordGuessed = () => {
        return currentWordData.word.split("").every((letter) => selectedLetters.includes(letter));
    };

    const handleGuess = () => {
        if (isWordGuessed()) {
            setMessage("Congratulations! You have guessed the word correctly!");
            setMessageColor("green");
            setStars(stars + 1);
            setTimeout(() => {
                resetGameWithoutResettingStars();
            }, 2000); // Vänta 2 sekunder innan du visar nästa ord
        } else {
            setMessage("Incorrect guess. Try again!");
            setMessageColor("red");
            setRevealWord(true);
        }
    };

    const resetGameWithoutResettingStars = () => {
        setCurrentWordData(fetchRandomWord());
        setMessage("");
        setMessageColor("black");
        setSelectedLetters([]);
        setRemainingHints(3);
        setRevealWord(false);
        setIncorrectGuesses(0);
    };

    const resetGame = () => {
        resetGameWithoutResettingStars();
        setStars(0); // Återställ stjärnor vid fullständig omstart
    };

    return (
        <div className="container">
            <div className="game-box">
                <h1>Word Guessing Game</h1>
                <div className="word-container">
                    {Array.from(currentWordData.word).map((letter, index) => (
                        <div
                            key={index}
                            className={`letter ${
                                selectedLetters.includes(letter) ? "visible" : ""
                            }`}
                        >
                            {selectedLetters.includes(letter) ? letter : ""}
                        </div>
                    ))}
                </div>
                <p className="word-description">Hint: {currentWordData.description}</p>
                <div className="stars">
                    Stars: {"★".repeat(stars)} {/* Visa stjärnor */}
                </div>
                {message && (
                    <div className="message" style={{ color: messageColor }}>
                        <p>{message}</p>
                        {revealWord && <p>Correct word was: {currentWordData.word}</p>}
                    </div>
                )}
                <div className="button-section">
                    <div className="guess-section">
                        <button
                            onClick={resetGame}
                            className="restart-button"
                        >
                            Restart
                        </button>
                        <button
                            onClick={handleRemoveLastLetter}
                            disabled={!selectedLetters.length}
                            className="remove-button"
                        >
                            Remove Letter
                        </button>
                    </div>
                    <div className="letter-selection">
                        {renderLetterButtons()}
                    </div>
                    <div className="hints">
                        Hints Remaining: {remainingHints}{" "}
                        <button
                            onClick={handleHint}
                            disabled={remainingHints === 0}
                            className="hint-button"
                        >
                            Get Hint
                        </button>
                    </div>
                    {!message && (
                        <button
                            onClick={handleGuess}
                            disabled={!selectedLetters.length}
                            className="guess-button"
                        >
                            Guess
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WordGuessingGame;
