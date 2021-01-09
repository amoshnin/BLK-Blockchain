import EC, { ec } from "elliptic"
import { hasher } from "."
export const elliptic = new EC.ec("secp256k1")

interface IVerifySignature {
  publicKey: string
  data: string
  signature: ec.Signature
}

export default function verifySignature({
  publicKey,
  data,
  signature,
}: IVerifySignature) {
  const keyFromPublic = elliptic.keyFromPublic(publicKey, "hex")
  return keyFromPublic.verify(hasher(data), signature)
}
