import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
// import fs from 'fs';


const prisma = new PrismaClient();

export async function POST (req:NextRequest){


    try {
        const {score,email}= await req?.json()

        if( !email || !score){
            console.log("All flields req");
            
            return NextResponse.json({
                success:false,
                message:"All fields required!"
            },{status:404})
        }

        const newScore = await prisma.quiz.create({
            data:{
                id:randomUUID(),
                email:email,
                score:score,
            }
        })

        if(newScore){
            console.log("score added",newScore);

            return NextResponse.json({success:true,message:newScore},{status:201})
        }else{
            console.log("score not added",newScore);
            return NextResponse.json({success:false,message:"Something went wrong!"},{status:401})
        }

    } catch (error) {
        console.log("Error while registering report",error);
        
    }
}