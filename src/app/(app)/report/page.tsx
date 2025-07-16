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
    <div className="w-full min-h-screen py-6 px-2 bg-background">
      <h1 className="font-semibold text-xl text-center mb-6">Submit form</h1>
      <div className="flex justify-center">
        <form className="w-full max-w-lg flex flex-col gap-4 bg-card p-4 rounded-xl shadow mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <p className="mb-1">First Name</p>
              <Input
                placeholder="Enter your first name"
                type="text"
                id="first_name"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <p className="mb-1">Last Name</p>
              <Input
                placeholder="Enter your last name"
                type="text"
                id="last_name"
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <p className="mb-1">Email</p>
            <Input
              placeholder="example@gmail.com"
              type="email"
              id="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <p className="mb-1">Select type of scam</p>
            <Select onValueChange={handleSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types of scams</SelectLabel>
                  <SelectItem value="socialMedia">Social-Media</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="blackmail">Blackmail</SelectItem>
                  <SelectItem value="other">Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-1">Description</p>
            <Textarea
              onChange={(e)=>setDescripstion(e.target.value)}
              value={description}
              cols={5}
              placeholder="Please write full description.."
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="file">Upload File for proof</Label>
            <Input id="file" type="file" className="w-full" />
          </div>

          <div className="flex justify-center mt-2">
            <Button type="button" onClick={handleSubmit} className="w-full md:w-auto">Submit Report</Button>
          </div>
        </form>
      </div>
    </div>
  );
  }


export default Page;
