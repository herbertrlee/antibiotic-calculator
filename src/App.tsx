import { useCallback, useEffect, useState } from "react"
import "./App.css"
import { createClient } from "@supabase/supabase-js"
import Select from "react-select"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase.ts"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

type AntibioticOption = {
  label: string
  value: number
}

type State = {
  antibioticId?: number
}

function App() {
  const [state, setState] = useState<State>({})

  const updateState = (update: State) => {
    setState({
      ...state,
      ...update,
    })
  }

  return (
    <>
      <div>
        <h1>Antibiotic waste calculator</h1>
        <p>
          A tool to help doctors calculate the amount of plastic waste created
          by an antibiotic regimen.
        </p>
        <AntibioticSelect
          onSelect={(antibioticId) =>
            updateState({ antibioticId: antibioticId })
          }
        />
        {state.antibioticId && (
          <RouteSelect antibioticId={state.antibioticId} />
        )}
        <p>{state.antibioticId}</p>
      </div>
    </>
  )
}

const AntibioticSelect = ({
  onSelect,
}: {
  onSelect: (antibioticId: number) => void
}) => {
  const [antibioticOptions, setAntibioticOptions] = useState<
    AntibioticOption[]
  >([])

  const fetchAntibiotics = useCallback(async () => {
    const { data } = await supabase.from("antibiotic").select()
    setAntibioticOptions(
      data?.map((antibiotic) => {
        return { label: antibiotic.name, value: antibiotic.id }
      }) ?? [],
    )
  }, [setAntibioticOptions])

  useEffect(() => {
    fetchAntibiotics()
  }, [fetchAntibiotics])

  return antibioticOptions.length > 0 ? (
    <Select
      placeholder="Antibiotic"
      options={antibioticOptions}
      onChange={(newValue) => {
        if (newValue) {
          onSelect(newValue.value)
        }
      }}
    />
  ) : null
}

type RouteOption = {
  label: string
  value: string
}

const RouteSelect = ({ antibioticId }: { antibioticId: number }) => {
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([])

  const fetchRoutes = useCallback(async () => {
    const { data } = await supabase
      .from("regimen")
      .select("route_of_administration, count()")
      .eq("antibiotic_id", antibioticId)

    setRouteOptions(
      data?.map((result) => {
        const route = result["route_of_administration"]
        return { label: route, value: route }
      }) ?? [],
    )
  }, [setRouteOptions, antibioticId])

  useEffect(() => {
    fetchRoutes()
  }, [fetchRoutes])

  return <Select placeholder="Route of administration" options={routeOptions} />
}

export default App
