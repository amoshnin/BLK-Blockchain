import useSWR from "swr"

const PORT = 3155
export type routes =
  | "wallet-info"
  | "mine"
  | "transact"
  | "blocks"
  | "transaction-pool-map"
  | "mine-transactions"

export const useRequest = (url: routes) => {
  if (!url) {
    throw new Error("Path is required")
  }

  const response = useSWR(`http://localhost:${PORT}/api/${url}`, {
    fetcher,
  })

  return response
}

const fetcher = async (url: routes) => {
  return await fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then((response) => response.json())
}
