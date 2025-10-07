import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import FloatingChatbot from './components/FloatingChatbot'
import LandingPage from "./LandingPage/LandingPage";
import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from "@clerk/clerk-react";

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    const response = await axios.post('http://localhost:4000/ai/get-review', { code })
    setReview(response.data)
  }

  return (
    <>
      <SignedIn>
        {/* Navbar or top-right logout option */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
          background: "#111",
        }}>
          <UserButton afterSignOutUrl="/" />
        </div>

        <main>
          <div className="left">
            <div className="code">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  height: "100%",
                  width: "100%"
                }}
              />
            </div>
            <div
              onClick={reviewCode}
              className="review">Review</div>
          </div>
          <div className="right">
            <Markdown

              rehypePlugins={[rehypeHighlight]}

            >{review}</Markdown>
          </div>
        </main>
        <FloatingChatbot />
      </SignedIn>
      <SignedOut>
        <LandingPage />
        <SignIn path="/sign-in" routing="path" />
        <SignUp path="/sign-up" routing="path" />
      </SignedOut>
    </>
  )
}

export default App