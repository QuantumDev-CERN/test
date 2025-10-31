import { useEffect, useState, useMemo } from "react";

const TypingWords = () => {
  const words = useMemo(() => ["feel.", "convert.", "resonate."], []);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(waitTimer);
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        } else {
          setIsWaiting(true);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, isWaiting, currentWordIndex, words]);

  return (
    <span className="relative">
      <span className="italic text-white">{currentText}</span>
      <span className="animate-pulse text-white ml-1">|</span>
    </span>
  );
};

export default TypingWords;
