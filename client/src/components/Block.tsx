// # PLUGINS IMPORTS //
import styled from "styled-components"

// # COMPONENTS IMPORTS //

// # EXTRA IMPORTS //

/////////////////////////////////////////////////////////////////////////////

export default function Block({ block }) {
  return (
    <Wrapper>
      <h5>{block.hash}</h5>
      {block.data.map((transaction, index) => {
        const date = transaction.inputs.timestamp
        return (
          <div key={transaction.id}>
            <span>{index + 1}. </span>
            <span>
              ID: ({transaction.id} -{" "}
              {date ? new Date(date).toLocaleString() : "miner reward"})
            </span>
          </div>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-bottom: 20px;
`
