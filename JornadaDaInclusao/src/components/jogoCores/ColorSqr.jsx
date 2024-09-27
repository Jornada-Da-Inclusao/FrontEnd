import React from "react";
import { random } from "../../hooks/utils.jsx"
import { colors } from "./Data.jsx"
import classes from '../../assets/styles/jogoCores.module.css'

function ColorSqr({ color }) {
  return (
    <div
      className={classes.square}
      style={color.theme}
    >
    </div>
  )
}

export function Colors() {
  const colorSqrs = colors.map(element =>
    <ColorSqr color={element} />
  )

  return random(colorSqrs)
}
