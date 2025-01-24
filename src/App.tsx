import { useCallback, useEffect, useState } from "react"
import "./App.css"
import { createClient } from "@supabase/supabase-js"
import Select from "react-select"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase.ts"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

type NumOption = {
  label: string
  value: number
}

type WasteLineItem = {
  label: string
  unitCount: number
  wasteMgPerUnit: number
}

function App() {
  const [antibioticId, setAntibioticId] = useState<number | undefined>()
  const [route, setRoute] = useState<string | undefined>()
  const [form, setForm] = useState<string | undefined>()
  const [doseMg, setDoseMg] = useState<number | undefined>()

  const [perDoseLineItems, setPerDoseLineItems] = useState<WasteLineItem[]>([])

  const calculateWaste = useCallback(async () => {
    const { data } = await supabase
      .from("regimen")
      .select()
      .eq("antibiotic_id", antibioticId)
      .eq("route_of_administration", route)
      .eq("form", form)
      .eq("dose_mg", doseMg)

    if (data) {
      const regimen = data[0]
      setPerDoseLineItems([
        {
          label: "Antibiotic wrappings",
          unitCount: regimen["wrapping_units"],
          wasteMgPerUnit: regimen["wrapping_mg_plastic_per_unit"],
        },
        {
          label: "Antibiotic vials",
          unitCount: regimen["vial_units"],
          wasteMgPerUnit: regimen["vial_mg_plastic_per_unit"],
        },
        {
          label: "Antibiotic vial caps",
          unitCount: regimen["vial_cap_units"],
          wasteMgPerUnit: regimen["vial_cap_mg_plastic_per_unit"],
        },
        {
          label: "Syringes",
          unitCount: regimen["syringe_units"],
          wasteMgPerUnit: regimen["syringe_mg_plastic_per_unit"],
        },
        {
          label: "Needles",
          unitCount: regimen["needle_units"],
          wasteMgPerUnit: regimen["needle_mg_plastic_per_unit"],
        },
        {
          label: "Needle caps",
          unitCount: regimen["needle_cap_units"],
          wasteMgPerUnit: regimen["needle_cap_mg_plastic_per_unit"],
        },
        {
          label: "Needle hubs",
          unitCount: regimen["needle_hub_units"],
          wasteMgPerUnit: regimen["needle_hub_mg_plastic_per_unit"],
        },
        {
          label: "IV bags",
          unitCount: regimen["iv_bag_units"],
          wasteMgPerUnit: regimen["iv_bag_mg_plastic_per_unit"],
        },
      ])
    }
  }, [antibioticId, doseMg, form, route])

  useEffect(() => {
    if (antibioticId && route && form && doseMg) {
      calculateWaste()
    }
  }, [antibioticId, calculateWaste, doseMg, form, route])

  return (
    <>
      <div>
        <h1>Antibiotic waste calculator</h1>
        <p>
          A tool to help doctors calculate the amount of plastic waste created
          by an antibiotic regimen.
        </p>
        <AntibioticSelect onSelect={setAntibioticId} />
        {antibioticId && (
          <>
            <RouteSelect antibioticId={antibioticId} onSelect={setRoute} />
          </>
        )}
        {antibioticId && route && (
          <FormSelect
            antibioticId={antibioticId}
            route={route}
            onSelect={setForm}
          />
        )}
        {antibioticId && route && form && (
          <DoseSelect
            antibioticId={antibioticId}
            route={route}
            form={form}
            onSelect={setDoseMg}
          />
        )}
        {perDoseLineItems.length > 0 && (
          <>
            <p>
              Total plastic waste per dose:{" "}
              {perDoseLineItems
                .map((lineItem) => lineItem.unitCount * lineItem.wasteMgPerUnit)
                .reduce((acc, value) => acc + value, 0)}{" "}
              mg
            </p>
            <ul>
              {perDoseLineItems.map((lineItem) => (
                <li>
                  {lineItem.label}: {lineItem.wasteMgPerUnit} mg x{" "}
                  {lineItem.unitCount} units ={" "}
                  {lineItem.wasteMgPerUnit * lineItem.unitCount} mg
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}

const AntibioticSelect = ({
  onSelect,
}: {
  onSelect: (antibioticId: number) => void
}) => {
  const [antibioticOptions, setAntibioticOptions] = useState<NumOption[]>([])

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

type StringOption = {
  label: string
  value: string
}

const RouteSelect = ({
  antibioticId,
  onSelect,
}: {
  antibioticId: number
  onSelect: (route: string) => void
}) => {
  const [routeOptions, setRouteOptions] = useState<StringOption[]>([])

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

  return (
    <Select
      placeholder="Route of administration"
      options={routeOptions}
      onChange={(newValue) => {
        if (newValue) {
          onSelect(newValue.value)
        }
      }}
    />
  )
}

const FormSelect = ({
  antibioticId,
  route,
  onSelect,
}: {
  antibioticId: number
  route: string
  onSelect: (form: string) => void
}) => {
  const [formOptions, setFormOptions] = useState<StringOption[]>([])

  const fetchForms = useCallback(async () => {
    const { data } = await supabase
      .from("regimen")
      .select("form, count()")
      .eq("antibiotic_id", antibioticId)
      .eq("route_of_administration", route)

    setFormOptions(
      data?.map((result) => {
        const form = result["form"]
        return { label: form, value: form }
      }) ?? [],
    )
  }, [setFormOptions, antibioticId])

  useEffect(() => {
    fetchForms()
  }, [fetchForms])

  return (
    <Select
      placeholder="Form"
      options={formOptions}
      onChange={(newValue) => {
        if (newValue) {
          onSelect(newValue.value)
        }
      }}
    />
  )
}

const DoseSelect = ({
  antibioticId,
  route,
  form,
  onSelect,
}: {
  antibioticId: number
  route: string
  form: string
  onSelect: (dose: number) => void
}) => {
  const [doseOptions, setDoseOptions] = useState<NumOption[]>([])

  const fetchForms = useCallback(async () => {
    const { data } = await supabase
      .from("regimen")
      .select("dose_mg, count()")
      .eq("antibiotic_id", antibioticId)
      .eq("route_of_administration", route)
      .eq("form", form)

    setDoseOptions(
      data?.map((result) => {
        const dose = result["dose_mg"]
        return { label: `${dose} mg`, value: dose }
      }) ?? [],
    )
  }, [setDoseOptions, antibioticId])

  useEffect(() => {
    fetchForms()
  }, [fetchForms])

  return (
    <Select
      placeholder="Dose"
      options={doseOptions}
      onChange={(newValue) => {
        if (newValue) {
          onSelect(newValue.value)
        }
      }}
    />
  )
}

export default App
