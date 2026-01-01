"use client";
import { useState, useEffect } from "react";
import LexpalAISection from "../Dashboard/components/LexpalAISection";
import Header from "../Dashboard/components/Header";
import ChatsSection from "../Dashboard/components/ChatsSection";
import { useRouter } from "next/navigation";

type Conversation = any; 


export default function DashboardPage() {
  const router=useRouter();
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL || "http://localhost:5001";
 const [recentConvos, setRecentConvos] = useState<Conversation[] | null>(null);
   const [recentLoading, setRecentLoading] = useState(false);
   const [recentError, setRecentError] = useState<string | null>(null);

   const [firstName, setFirstName]=useState<String>("");


   useEffect(() => {
       const ac = new AbortController();
       
       const fetchName= async()=>{
        try {
          const res= await fetch(`${server_url}/api/user/username`,{
            method:"GET",
            credentials:"include",
            headers:{"Content-Type": "application/json"},
            signal:ac.signal
  
          });

           if (!res.ok) {
             const text = await res.text();
             throw new Error(`Recent convos fetch failed: ${res.status} ${text}`);
           }
            const data = await res.json();
            setFirstName(data.name);
          
        } catch (error) {
          console.log(error);
        }
       }
       
   
       async function fetchRecentConvos() {
         setRecentLoading(true);
         setRecentError(null);
         try {
           const res = await fetch(`${server_url}/api/AI/recent-conversation`, {
             method: "GET",
             credentials: "include",
             headers: { "Content-Type": "application/json" },
             signal: ac.signal,
           });
   
           if (!res.ok) {
             const text = await res.text();
             throw new Error(`Recent convos fetch failed: ${res.status} ${text}`);
           }
   
           const data = await res.json();
           // assume response shape { conversations: [...] } or adjust as needed
           setRecentConvos(data.conversations ?? data);
         } catch (err: any) {
           if (err.name !== "AbortError") setRecentError(err.message || "Unknown error");
         } finally {
           setRecentLoading(false);
         }
       }

   
       fetchName();
       fetchRecentConvos();
   
       return () => ac.abort();
     }, [server_url]);

  return (
    <div className="dashboard-root">
      <Header firstName={firstName} />
     
     <main style={{ paddingTop: "10px", paddingBottom: "64px" }}>
      

        <section id="lexpal-ai">
          <LexpalAISection 
           conversations={recentConvos}
            loading={recentLoading}
            error={recentError}
            router={router}/>
        </section>

        <section id="chats">
                  <ChatsSection
                  router={router} />
                </section>

      
      </main>
    </div>
  );
}