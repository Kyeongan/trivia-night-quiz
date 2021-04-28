import React, { useState } from "react";
import { fetchQuizQuestions, Difficulty, QuestionState } from "./API";
import QuestionCard from "./components/QuestionCard";
import { GlobalStyle } from "./App.Styles";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Button, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

export type AnswerObject = {
	question: string;
	answer: string;
	correct: boolean;
	correctAnswer: string;
};

const App: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<QuestionState[]>([]);
	const [number, setNumber] = useState(0);
	const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(true);
	const [totalQuestion, setTotalQuestion] = useState(5);

	const startTrivia = async () => {
		setLoading(true);
		setGameOver(false);

		const newQuestions = await fetchQuizQuestions(
			totalQuestion,
			Difficulty.EASY
		);

		setQuestions(newQuestions);
		setScore(0);
		setUserAnswers([]);
		setNumber(0);
		setLoading(false);
	};

	const checkAnswer = (e: any) => {
		if (!gameOver) {
			// User's answer
			const answer = e.currentTarget.value;
			// Check answer against correct answer
			const correct = questions[number].correct_answer === answer;
			// Add score if answer is correct
			if (correct) setScore((prev) => prev + 1);
			// Save pm the answer in the array for user answers
			const answerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer
			};
			setUserAnswers((prev) => [...prev, answerObject]);
		}
	};

	const nextQuestion = () => {
		// Move on to the next question if not the last question
		const nextQ = number + 1;

		if (nextQ === totalQuestion) {
			setGameOver(true);
		} else {
			setNumber(nextQ);
		}
	};

	const handleChangeTotalNumberOfQuestion = (event: any) => {
		setTotalQuestion(event.target.value);
	};

	return (
		<>
			<GlobalStyle />
			<div className="App">
				<h1>Trivia Night Quiz!</h1>
				{gameOver || userAnswers.length === totalQuestion ? (
					<p>How many questions would you like to solve?</p>
				) : null}
				<p></p>
				{gameOver || userAnswers.length === totalQuestion ? (
					<FormControl component="fieldset">
						<RadioGroup
							defaultValue="5"
							onChange={handleChangeTotalNumberOfQuestion}
						>
							<FormControlLabel value="5" control={<Radio />} label="5" />
							<FormControlLabel value="10" control={<Radio />} label="10" />
							<FormControlLabel value="20" control={<Radio />} label="20" />
							<FormControlLabel value="30" control={<Radio />} label="30" />
						</RadioGroup>
					</FormControl>
				) : null}
				<p></p>
				{gameOver || userAnswers.length === totalQuestion ? (
					<Button variant="contained" color="primary" onClick={startTrivia}>
						Start Here
					</Button>
				) : null}
				{!gameOver ? (
					<p className="score">
						Score: {score} / {totalQuestion}{" "}
					</p>
				) : null}
				{loading ? <p>Loading Questions...</p> : null}

				{!loading && !gameOver && (
					<QuestionCard
						questionNo={number + 1}
						totalQuestions={totalQuestion}
						question={questions[number].question}
						answers={questions[number].answers}
						userAnswer={userAnswers ? userAnswers[number] : undefined}
						callback={checkAnswer}
					/>
				)}
				<p></p>
				{!gameOver &&
				!loading &&
				userAnswers.length === number + 1 &&
				number !== totalQuestion - 1 ? (
					<Button variant="contained" color="primary" onClick={nextQuestion}>
						Next
						<ArrowForwardIcon />
					</Button>
				) : null}
			</div>
		</>
	);
};

export default App;
