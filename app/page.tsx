'use client'
import Image from "next/image";
import OELogo from '../public/assets/images/oet_logo.png'
import { Fragment, useEffect, useState } from "react";
// import { useApiGet,TApiResponse } from "./hook";
import { FaUser, FaUserAlt } from 'react-icons/fa';
import { AiOutlineRobot } from "react-icons/ai";

export default function Home() {

  const [chatList, setChatList] = useState<any>([
    {
      User:"what is health?",
      AI:"Health is ..."
    }
  ])

  const [questionsList, setQuestionsList] = useState<any>([])
  const [answersList, setAnswersList] = useState<any>([])
  const [question, setQuestion] =  useState<any>()

  const handleQuestion = (event:any) => {
    setQuestion(event.target.value);
  };

  const useFetch = (url:any, options:any):any => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const fetchData = async (body:any) => {
      setIsLoading(true);
      try {
        const res = await fetch(url, {
          ...options,
          body: JSON.stringify(body),
        });
        const json = await res.json();
        setResponse(json);
      } catch (error:any) {
        setError(error);
      }
      setIsLoading(false);
    };
  
    return { response, error, isLoading, fetchData };
  }

  const { response, isLoading, fetchData } = useFetch('https://openexchangebot.azurewebsites.net/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleSendClick = () => {
    setQuestionsList([...questionsList,question])
    setQuestion('')
    fetchData({ question });
  };

  useEffect(() => {
    if (response && response?.answer) {
      setAnswersList([...answersList, response.answer])
    }
  }, [response]);




  return (
    <main>
      <div className="header w-100 h-[10vh] bg-[#343a40]">
        <div className="OE-logo">
          <Image className="w-[15vw] h-[7vh] pl-5 pt-5" src={OELogo} alt="OE-logo"/>
        </div>
      </div>
      <div className="flex flex-col pl-10 pr-10 pt-10" style={{height: "calc(100vh - 11vh)"}}>
        <div className="flex-1 overflow-y-auto">
        <ul className="px-4 py-2">
          <li style={{ marginBottom: '8px' }}>
            <div className="flex items-center">
              <AiOutlineRobot className="mr-2"/>AI
            </div>
             Hi, How may I assist you today?
          </li>
          {questionsList.map((ques: string, index: number) => (
            <Fragment key={index}>
              <li style={{ marginBottom: '8px' }}>
                <div className="flex items-center">
                  <FaUser className="mr-2"/>You
                </div>
                 {ques}
              </li>
              {answersList[index] && (
                <li style={{ marginBottom: '8px' }}>
                  <div className="flex items-center">
                    <AiOutlineRobot className="mr-2"/>AI
                  </div> 
                  {answersList[index]}
                </li>
              )}
            </Fragment>
          ))}
       </ul>
        </div>
        <div className="relative">
          <textarea 
            value={question}
            onChange={handleQuestion}
            className="resize-y block w-full h-16 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          <button
            onClick={handleSendClick}
            className="absolute bottom-2 right-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-black-600">Send</button>
        </div>
      </div>
    </main>
  );
}
