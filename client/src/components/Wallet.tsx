// # PLUGINS IMPORTS //
import { useRequest } from "../shared/config"

// # COMPONENTS IMPORTS //

// # EXTRA IMPORTS //

/////////////////////////////////////////////////////////////////////////////

export default function Wallet() {
  const { error, data } = useRequest("wallet-info")

  if (error) {
    return <div>Some error occured...</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>Address: {data.address}</div>
      <div>Balance: {data.balance}</div>
    </div>
  )
}
