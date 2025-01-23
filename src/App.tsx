import {useCallback, useEffect, useState} from 'react'
import './App.css'
import {createClient} from "@supabase/supabase-js";
import Select from "react-select";


const supabase = createClient("https://ipwagddgrsuwbwxdntpg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd2FnZGRncnN1d2J3eGRudHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MDk3NDcsImV4cCI6MjA1MzE4NTc0N30.Ukpeh8P9Ap2d43pRiiSgCwqTZSi4dEP1ebRm7IinLI8")


type Option = {
    label: string
    value: number
}

function App() {
    const [antibioticOptions, setAntibioticOptions] = useState<Option[]>([])
    const [selectedAntibioticId, setSelectedAntibioticId] = useState<number | null>(null)

    const fetchAntibiotics = useCallback(async () => {
        const {data} = await supabase.from("antibiotic").select()
        console.log(data)
        setAntibioticOptions(data?.map((antibiotic) => {
            return {label: antibiotic.name, value: antibiotic.id}
        }) ?? [])
    }, [setAntibioticOptions])

    useEffect(() => {
        fetchAntibiotics()
    }, [fetchAntibiotics])

    console.log(selectedAntibioticId)

    return (
        <>
            <div>
                <Select options={antibioticOptions}
                        onChange={(newValue) => {
                            if (!!newValue) {
                                setSelectedAntibioticId(newValue.value)
                            }
                        }}
                />
            </div>
        </>
    )
}

export default App
