import crypto from "crypto"

export default function hasher(...inputs: any) {
  const hash = crypto.createHash("sha256")

  hash.update(inputs.sort().join(" "))
  return hash.digest("hex")
}
