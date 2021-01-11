// # PLUGINS IMPORTS //
import { useRequest } from "../shared/config"
import styled from "styled-components"

// # COMPONENTS IMPORTS //
import Block from "./Block"

// # EXTRA IMPORTS //

/////////////////////////////////////////////////////////////////////////////

export default function Blocks() {
  const { error, data } = useRequest("blocks")

  if (error) {
    return <div>Some error occured...</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  console.log(data)

  return (
    <Wrapper>
      <h3>Blocks List</h3>
      {data.map((block) => (
        <Block key={block.hash} block={block} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-left: 20px;
`
