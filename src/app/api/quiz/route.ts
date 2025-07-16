import { NextResponse } from 'next/server';
import { customQuestions } from './customQuestions';

export async function GET() {
  // Randomize the questions a bit
  const shuffled = customQuestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10); // return only 10 questions for the quiz

  return NextResponse.json(selected);
}
