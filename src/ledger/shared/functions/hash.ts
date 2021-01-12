import crypto from "crypto"

export default function hasher(...inputs: any) {
  const hash = crypto.createHash("sha256")

  hash.update(
    inputs
      .map((input: any) => JSON.stringify(input))
      .sort()
      .join(" ")
  )
  return hash.digest("hex")
}
