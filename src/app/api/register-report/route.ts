import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
// import fs from 'fs';


const prisma = new PrismaClient();

export async function POST (req:NextRequest){


    try {
        const {first_name,last_name,email,description,scamType}= await req?.json()

        if(!first_name || !last_name || !email || !description ||!scamType){
            console.log("All flields req");
            
            return NextResponse.json({
                success:false,
                message:"All fields required!"
            },{status:404})
        }

        const newReport = await prisma.report.create({
            data:{
                id:randomUUID(),
                first_name:first_name,
                last_name:last_name,
                email:email,
                description:description,
                scamType:scamType
            }
        })

        if(newReport){
            console.log("USer created",newReport);

            return NextResponse.json({success:true,message:newReport},{status:201})
        }else{
            console.log("USer created",newReport);
            return NextResponse.json({success:false,message:"Something went wrong!"},{status:401})
        }

    } catch (error) {
        console.log("Error while registering report",error);
        
    }
}