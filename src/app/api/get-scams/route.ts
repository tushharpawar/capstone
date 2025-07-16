import {  NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {

    const scams = await prisma.scam.findMany();

    if(!scams){
        return NextResponse.json(
            {
              success: false,
              message: "There is no scam",
              data: scams,
            },
            { status: 401 }
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: "scam fetched successfully!",
        data: scams,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error occurred:", error.message);
    } else if (error instanceof Error) {
      console.error("An error occurred:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get scams",
      },
      { status: 500 }
    );
  }
};