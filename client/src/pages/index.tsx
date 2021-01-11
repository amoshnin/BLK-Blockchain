// # PLUGINS IMPORTS //

import { useEffect } from "react"
import { useRequest } from "../shared/config"

// # COMPONENTS IMPORTS //

// # EXTRA IMPORTS //

/////////////////////////////////////////////////////////////////////////////

export default function Index() {
  // const res = useRequest("wallet-info")

  useEffect(() => {
    fetch("http://localhost:3573/api/blocks", {})
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((er) => console.log(er))
  })

  return (
    <div>
      <div>Address:</div>
      <div>Balance:</div>
    </div>
  )
}
