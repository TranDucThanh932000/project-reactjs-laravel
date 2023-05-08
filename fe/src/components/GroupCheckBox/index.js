import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function GroupCheckBox(props) {
  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      {props.listChildren.map((x) => (
        <FormControlLabel
          key={x.key}
          label={x.label}
          control={<Checkbox checked={x.checked} onChange={x.handleChange} />}
        />
      ))}
    </Box>
  );

  const handleChangeParent = (event) => {
    props.handleChangeParent(event.target.checked);
  };

  return (
    <div>
      <FormControlLabel
        label={props.labelParent}
        control={
          <Checkbox
            checked={ props.checkAll() }
            indeterminate={ !props.checkAll() }
            onChange={handleChangeParent}
          />
        }
      />
      {children}
    </div>
  );
}
