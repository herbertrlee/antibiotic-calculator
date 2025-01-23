import {useCallback, useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {createClient} from "@supabase/supabase-js";


const supabase = createClient("https://ipwagddgrsuwbwxdntpg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd2FnZGRncnN1d2J3eGRudHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MDk3NDcsImV4cCI6MjA1MzE4NTc0N30.Ukpeh8P9Ap2d43pRiiSgCwqTZSi4dEP1ebRm7IinLI8")


function App() {
  const [count, setCount] = useState(0)
    const [regimens, setRegimens] = useState([])

    const fetchRegimens = useCallback(async () => {
        const { data } = await supabase.from("regimen").select()
        console.log(data)
    }, [setRegimens])

    useEffect(() => {
        fetchRegimens()
    }, [fetchRegimens, regimens]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
