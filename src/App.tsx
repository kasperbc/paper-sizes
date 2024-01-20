import React, { useState } from 'react';
import './App.css';
import { CssVarsProvider, Input, Radio, RadioGroup, Typography } from '@mui/joy';
import PaperSizeData from "./paper_sizes.json"

enum UnitTypes {
  millimeters = "mm",
  points = "pt",
  inches = "in"
}

enum SizeTypes {
  width = "paperWidth",
  height = "paperHeight"
}

var currSize = [1.0, 1.0]
var currType = UnitTypes.millimeters;

function App() {
  const [output, setOutput] = useState("")

  function onSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Update currSize to new value
    var sizeChangeType = event.target.id as SizeTypes
    
    // Check if width or height values are parsed incorrectly
    var widthElement = document.getElementById("paperWidth") as HTMLInputElement
    var heightElement = document.getElementById("paperHeight") as HTMLInputElement

    var widthValue = parseFloat(widthElement.value.replace(",", "."))
    var heightValue = parseFloat(heightElement.value.replace(",", "."))

    if (isNaN(widthValue) || isNaN(heightValue)) {
      setOutput("")
      return
    }

    if (sizeChangeType == SizeTypes.width) {
      console.log("passed x")
      currSize[0] = widthValue
    }
    else if (sizeChangeType == SizeTypes.height) {
      console.log("passed y")
      currSize[1] = heightValue
    }

    updateOutput()
  }

  // When the type radio menu is changed
  function onTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    currType = event.target.value as UnitTypes
    updateOutput()
  }

  function getClosestPaperSize(): string {
    var closestPaperSize = "None"
    var closestDiff = Number.MAX_VALUE

    PaperSizeData.forEach((sizeData) => {
      var width = sizeData.mm_W
      var height = sizeData.mm_L

      if (currType == UnitTypes.inches) {
        width = sizeData.inch_W
        height = sizeData.inch_L
      }
      else if (currType == UnitTypes.points) {
        width = sizeData.point_W
        height = sizeData.point_L
      }

      var diff = Math.abs(currSize[0] - width) + Math.abs(currSize[1] - height)
      console.log(diff + " " + sizeData.type)
      if (diff < closestDiff) {
        closestDiff = diff
        closestPaperSize = sizeData.type
      }
    })
    return closestPaperSize
  }

  function updateOutput() {
    setOutput("Your input is closest to the " + getClosestPaperSize() + " standard!")
  }

  return (
    <div className="App">
      <CssVarsProvider defaultMode="dark">
        <div className="Info">
          <Typography level="h1">Paper Size Calculator</Typography>
          <Typography>Input your paper size below and it will tell you what standard size is the closest!</Typography>
        </div>
        <div className="Input">
          <div className="SizeInput">
            <Input variant="solid" size="lg" placeholder="Width" id="paperWidth" className="Input" onChange={onSizeChange} />
            <Typography className="Seperator">x</Typography>
            <Input variant="solid" size="lg" placeholder="Height" id="paperHeight" className="Input" onChange={onSizeChange} />
          </div>
          <div className="TypeInput">
            <RadioGroup defaultValue="mm" orientation="horizontal" onChange={onTypeChange}>
              <Radio value="mm" label="Millimeters" />
              <Radio value="pt" label="Points" />
              <Radio value="in" label="Inches" />
            </RadioGroup>
          </div>
        </div>
        <Typography className="Output" id="output">
          {output}
        </Typography>
      </CssVarsProvider>
    </div>
  );
}

export default App;
