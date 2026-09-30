import { useState, useEffect } from "react";
import { Pianora } from "@norarcasey/pianora";
import "@norarcasey/pianora/style.css";
import "./App.css";
import droidVideo from "./assets/video/droid.mp4";
import TextType from "./components/TypeText";

const App = () => {
  const [showPiano, setShowPiano] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isFlagCorrect, setIsFlagCorrect] = useState<boolean>(false);
  const [isFlagVisible, setFlagVisible] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const rightCombination: string = "gggeugeug";

  const inputBg = isFlagCorrect
    ? "#3dbe02"
    : isError
      ? "#e53935"
      : "rgb(57, 57, 185)";

  const handleClick = () => {
    if (inputValue === rightCombination) {
      setIsFlagCorrect(true);
      setIsError(false);
    } else {
      setIsFlagCorrect(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        setInputValue((prev) => prev.slice(0, -1));
        setIsError(false); // ← сброс
        return;
      }
      if (e.key === "Enter") {
        return;
      }
      if (e.key.length === 1) {
        setInputValue((prev) => prev + e.key);
        setIsError(false); // ← сброс
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="mainContainer">
      <video className="videoContainer" autoPlay loop muted playsInline>
        <source src={droidVideo} type="video/mp4" />
      </video>

      <section className="droidMessageContainer">
        <TextType
          text={
            "Мы потерпели поражение... Их лидер... Черный плащ, дыхание слышно за милю... И эта музыка, навевающая ужас..."
          }
          // typingSpeed={125}
          typingSpeed={500}
          pauseDuration={1500000}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
          variableSpeed={{ min: 60, max: 120 }}
          cursorBlinkDuration={0.5}
          className={`droidText ${!isFlagCorrect ? "droidTextVisible" : "droidTextHidden"}`}
          loop={false}
          onTypingComplete={() => setShowPiano(true)}
        />
        {isFlagCorrect ? (
          <>
            <TextType
              text={"Да... Это она... Забирай... "}
              // typingSpeed={125}
              typingSpeed={500}
              pauseDuration={1500000}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              variableSpeed={{ min: 60, max: 120 }}
              cursorBlinkDuration={0.5}
              className="droidText"
              loop={false}
              onTypingComplete={() => setFlagVisible(true)}
            />
            {isFlagVisible && (
              <p className="flag">flag&#123;v@der_wa3_4ere&#125;</p>
            )}
          </>
        ) : null}

        <div
          className={`pianoContainer ${showPiano && !isFlagCorrect ? "pianoVisible" : "pianoHidden"}`}
        >
          <Pianora
            initialOctave={4}
            enableComputerKeyboard={true}
            showRecorder={false}
            title=""
          />
          <div className="inputContainer">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              placeholder=""
              readOnly
              className="notesInput"
              style={{ backgroundColor: inputBg }}
            />
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setIsError(false);
              }}
              className="xButton"
            >
              X
            </button>
          </div>
          <button type="button" className="notesButton" onClick={handleClick}>
            Отправить
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
