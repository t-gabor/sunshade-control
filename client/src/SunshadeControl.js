import { useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { ToggleButton } from 'primereact/togglebutton'
import Weather from './Weather'

const getToken = () => {
    const storageKey = `sb-bngohrfgqptumyeosasa-auth-token`
    const sessionDataString = localStorage.getItem(storageKey)
    const sessionData = JSON.parse(sessionDataString || "null")
    const token = sessionData?.access_token

    return token
}

export default function Buttons() {

    const [auto, setAuto] = useState(false)
    const [message, setMessage] = useState("")
    const [weather, setWeather] = useState()

    function fetchApi(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
        return fetch(url, {
            headers,
            ...options
        })
    }

    function getApi(url) {
        return fetchApi(url)
            .then(res => res.json())
            .catch((e) => setMessage(e.message))
    }

    function postApi(url, body) {
        fetchApi(url, {
            method: 'POST',
            body
        }).catch((e) => setMessage(e.message))
    }

    useEffect(() => {
        getApi("/api/weather")
            .then(json => setWeather(json))
    })

    useEffect(() => {
        getApi("/api/auto")
            .then(json => setAuto(json.state === "on"))
            .catch((e) => setMessage(e.message))
    })

    function postAuto(auto) {
        postApi("/api/auto/", JSON.stringify({ state: auto ? "on" : "off" }))
        setAuto(auto)
    }

    return (
        <div>
            <Weather weather={weather}/>
            <Button label="Open" onClick={() => postApi("/api/control/", JSON.stringify({ state: "open" }))} />
            <Button label="Close" onClick={() => postApi("/api/control/", JSON.stringify({ state: "close" }))} />
            <Button label="Update" onClick={() => postApi("/api/control/", JSON.stringify({ state: "update" }))} />
            <ToggleButton label="Auto" onLabel="Auto enabled" offLabel="Auto disabled" checked={auto} onChange={(e) => postAuto(e.value)} />
            {message}
        </div>
    );
}