"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import axios from "axios";

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type LeaderboardEntry = {
  id:string,
  email: string;
  score: number;
};

const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [username, setUsername] = useState("");
  const [userAnswers, setUserAnswers] = useState<{ answer: string; correct: boolean }[]>([]);

  const fetchQuestions = async () => {
    const res = await fetch("/api/quiz");
    const data = await res.json();
    setQuestions(data);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  async function fetchLeaderBoard() {
    const res = await axios.get('/api/get-leaderboard')
    console.log("Data",res);
    
    setLeaderboard(res.data)
  }

  useEffect(() => {
    // const saved = localStorage.getItem("quiz-leaderboard");
    // if (saved) setLeaderboard(JSON.parse(saved));
    fetchLeaderBoard()
  }, []);

  // const saveLeaderboard = (entry: LeaderboardEntry) => {
  //   const updated = [...leaderboard, entry]
  //     .sort((a, b) => b.score - a.score)
  //     .slice(0, 5);
  //   setLeaderboard(updated);
  //   localStorage.setItem("quiz-leaderboard", JSON.stringify(updated));
  // };

  const handleAnswer =async (answer: string) => {
    const correct = questions[currentQuestionIndex].correct_answer === answer;
    setUserAnswers((prev) => [
      ...prev,
      { answer, correct }
    ]);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 === questions.length) {
      setQuizCompleted(true);
      await axios.post('/api/post-user-score',{
        email:username,
        score
      })
      console.log("Score data sent!")
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    if (username.trim()) {
      fetchQuestions();
    } else {
      alert("Please enter your name.");
    }
  };

  useEffect(() => {
    if (quizCompleted && username) {
      // saveLeaderboard({ name: username, score });
      fetchLeaderBoard()
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [quizCompleted,username]);

  const progress = ((currentQuestionIndex + (quizCompleted ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-foreground">🎮 Trivia Quiz</h1>

      {!questions.length && (
        <div className="flex flex-col gap-4 items-center">
          <input
            type="text"
            placeholder="Enter your name"
            className="border border-border bg-muted text-foreground rounded px-4 py-2 w-full max-w-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Start Quiz
          </motion.button>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mt-6 mb-4">
          <div className="w-full bg-border h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-blue-500 h-2"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {questions.length > 0 && !quizCompleted && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Q{currentQuestionIndex + 1}:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: questions[currentQuestionIndex].question,
                }}
              />
            </h2>
            <div className="flex flex-col gap-2 mt-4">
              {shuffle([
                questions[currentQuestionIndex].correct_answer,
                ...questions[currentQuestionIndex].incorrect_answers,
              ]).map((ans, i) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={i}
                  onClick={() => handleAnswer(ans)}
                  className="border border-border bg-muted text-foreground hover:bg-accent px-4 py-2 rounded text-left transition"
                  dangerouslySetInnerHTML={{ __html: ans }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {quizCompleted && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground">🎉 Quiz Completed!</h2>
          <p className="mt-2 text-lg text-foreground">
            Score: {score}/{questions.length}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuestions([])
              setScore(0)
            }
            }
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Play Again
          </motion.button>
        </motion.div>
      )}

      {quizCompleted && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2 text-foreground">Answer Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer?.correct;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card p-4 rounded-lg"
                >
                  <h4 className="text-lg font-semibold text-foreground">
                    Q{index + 1}:{" "}
                    <span dangerouslySetInnerHTML={{ __html: question.question }} />
                  </h4>
                  <div className="mt-2">
                    <motion.span
                      className={`font-medium transition-all ${
                        isCorrect ? "text-green-500" : "text-red-500"
                      }`}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                    >
                      Your Answer: {userAnswer?.answer}
                    </motion.span>
                    <div className="mt-2">
                      <motion.span
                        className="font-medium text-blue-600"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                      >
                        Correct Answer: {question.correct_answer}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-2 text-foreground">🏆 Leaderboard</h3>
        <ul className="space-y-2">
          <AnimatePresence>
            { leaderboard?.map((entry, i) => {

              if(i > 10){
                return;
              }

              let medal = "";
              let medalColor = "";

              if (i === 0) {
                medal = "🥇🏆";
                medalColor = "text-yellow-500";
              } else if (i === 1) {
                medal = "🥈";
                medalColor = "text-gray-400";
              } else if (i === 2) {
                medal = "🥉";
                medalColor = "text-orange-500";
              }

              return (
                <motion.li
                  key={entry.email + entry.score}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className="border border-border bg-card text-foreground p-2 rounded flex justify-between items-center"
                >
                  <span className={`flex items-center gap-2 font-medium ${medalColor}`}>
                    {medal && <span>{medal}</span>}
                    {entry.email}
                  </span>
                  <span className="font-semibold">{entry.score}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>

          {leaderboard.length === 0 && (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground"
            >
              No scores yet!
            </motion.li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default QuizPage;
