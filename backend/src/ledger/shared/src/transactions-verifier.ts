import EC, { ec } from "elliptic"
import { hasher } from ".."
import { IOutputMap } from "../../wallet/transaction.types"
export const elliptic = new EC.ec("secp256k1")

interface IVerifySignature {
  publicKey: string
  data: IOutputMap
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
