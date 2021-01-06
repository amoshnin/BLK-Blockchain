import { time } from "console"

interface IProps {
  timestamp: number
  lastHash: string
  hash: string
  data: any
}

export default class Block {
  constructor(readonly props: IProps) {}
}
