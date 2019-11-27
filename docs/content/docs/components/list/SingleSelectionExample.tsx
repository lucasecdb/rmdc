import { List, ListItem } from '@lucasecdb/rmdc'
import * as React from 'react'

const options = [
  {
    title: 'Orange',
  },
  {
    title: 'Apple',
  },
  {
    title: 'Banana',
  },
  {
    title: 'Melon',
  },
]

const SingleSelectionExample: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  return (
    <List
      singleSelection
      selectedIndex={selectedIndex}
      onSelectionChange={index => setSelectedIndex(index)}
    >
      {options.map(opt => (
        <ListItem key={opt.title}>{opt.title}</ListItem>
      ))}
    </List>
  )
}

export default SingleSelectionExample
