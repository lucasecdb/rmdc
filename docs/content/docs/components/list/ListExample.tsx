import { List, ListItem } from '@lucasecdb/rmdc'
import * as React from 'react'

const ListExample: React.FC = () => {
  return (
    <List style={{ marginBottom: '1.45rem' }}>
      <ListItem>Baby Yoda</ListItem>
      <ListItem>Luke Skywalker</ListItem>
      <ListItem>Leia Skywalker</ListItem>
      <ListItem>Han Solo</ListItem>
      <ListItem>Kylo Ren</ListItem>
    </List>
  )
}

export default ListExample
