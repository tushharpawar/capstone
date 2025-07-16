import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    const leaderboard = await prisma.quiz.findMany({
        orderBy: {
          score: 'desc',
        },
      });
    
      console.log("Fetched",leaderboard);
      return NextResponse.json(leaderboard);
}
