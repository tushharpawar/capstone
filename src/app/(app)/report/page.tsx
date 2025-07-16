'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import axios from 'axios'
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const Page = () => {

  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [email,setEmail] = useState('')
  const [scamType,setScamType] = useState('others')
  const [description,setDescripstion] = useState('')
  const {toast} = useToast()


  const handleSelect = (value:string) =>{
      setScamType(value)
  }

  const handleSubmit =async()=>{

    if(!firstName || !lastName || !description || !email){
      toast({
        title:"All fields required!",
        variant:'destructive'
      })
      return
    }

    try {
      const response = await axios.post('api/register-report',{
        first_name:firstName,
        last_name:lastName,
        email,
        scamType,
        description
      })

      if(response){
        setFirstName('')
        setLastName('')
        setScamType('')
        setEmail('')
        setDescripstion('')
        toast({
          title:"Report submitted!",
          description:"Our executives will contact you soon"
        })
        console.log("Report submitted!",response.data.message);
      }

    } catch (error) {
      toast({
        title:"Report not submitted!",
        description:"Our executives will contact you soon"
      })
      console.log("Error in registering report",error);
    }
    }
  return (
    <div className="w-screen h-screen">
      <h1 className=" font-semibold text-xl text-center">Submit form</h1>
      <div className=" flex justify-center">
        <div className="w-[70%] flex flex-col justify-center my-3">
          <div className="flex gap-5 mx-24">
            <div className="w-full">
              <p>First Name</p>
              <Input
                placeholder="Enter your first name"
                type="text"
                id="first_name"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
              ></Input>
            </div>
            <div className="w-full">
              <p>Last Name</p>
              <Input
                placeholder="Enter your last name"
                type="text"
                id="first_name"
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
              ></Input>
            </div>
          </div>

          <div className="my-3 mx-24">
            <p>Email</p>
            <Input
              placeholder="example@gmail.com"
              type="email"
              id="first_name"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            ></Input>
          </div>

          <div className="my-3 mx-24">
            <p>Select type of scam</p>
            <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Types of scams</SelectLabel>
                <SelectItem value="socialMedia">Social-Media</SelectItem>
                <SelectItem value="finance">Finanace</SelectItem>
                <SelectItem value="blackmail">Blackmail</SelectItem>
                <SelectItem value="other">Others</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>

          <div className="my-3 mx-24">
            <p>Descripstion</p>
            <Textarea
            onChange={(e)=>setDescripstion(e.target.value)}
            value={description}
            cols={5}
              placeholder="Please write full description.."
            ></Textarea>
          </div>

          <div className="my-3 mx-24">
          <Label htmlFor="file">Upload File for proof</Label>
          <Input id="file" type="file" />
        </div>

          <div className="flex justify-center">
          <Button type="submit" onClick={handleSubmit}>Submit Report</Button>
          </div>
        </div>
      </div>
    </div>
  );
  }


export default Page;
