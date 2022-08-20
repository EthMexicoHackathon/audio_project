import React from 'react'
import { Footer,Anchor,Image,Paragraph } from 'grommet';

export default function FooterComponent (props) {
  return(
    <Footer background="brand" pad="medium" size="small">
      <Anchor href="https://github.com/henrique1837/thevibes" target="_blank" rel="noreferrer">Github</Anchor>

    </Footer>
  )
}
