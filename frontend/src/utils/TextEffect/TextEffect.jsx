'use client';
import React, { useEffect, useState, useCallback } from 'react';
const lettersAndSymbols = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=;:<>,';
export function RandomizedTextEffect({ text }) {
  const [animatedText, setAnimatedText] = useState('');
  const getRandomChar = useCallback(
    () =>
      lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
    []
  );
  const animateText = useCallback(async () => {
    const duration = 120;
    const revealDuration = 120;
    const initialRandomDuration = 1000;
    const generateRandomText = () =>
      text
        .split('')
        .map(() => getRandomChar())
        .join('');
    setAnimatedText(generateRandomText());
    const endTime = Date.now() + initialRandomDuration;
    while (Date.now() < endTime) {
      await new Promise((resolve) => setTimeout(resolve, duration));
      setAnimatedText(generateRandomText());
    }
    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, revealDuration));
      setAnimatedText(
        (prevText) =>
          text.slice(0, i + 1) +
          prevText
            .slice(i + 1)
            .split('')
            .map(() => getRandomChar())
            .join('')
      );
    }
  }, [text, getRandomChar]);
  useEffect(() => {
    animateText();
  }, [text, animateText]);
  return <div className="">{animatedText}</div>;
}