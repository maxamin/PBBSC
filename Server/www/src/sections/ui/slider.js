import { Grid, Slider, Input } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { execOnce } from "next/dist/shared/lib/utils";

function SliderComponent({ value, onChange, min, max, step, icon: Icon }) {
  const handleInputChange = (event) => {
    onChange(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  return (
    <Grid sx={{marginLeft: "-20px"}} container spacing={2} alignItems="center">
      <Grid item>
        {<Icon/>}
      </Grid>
      <Grid item xs>
        <Slider
          sx={{width: 150}}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(_, newValue) => onChange(newValue)}
          aria-labelledby="input-slider"
        />
      </Grid>
      <Grid item>
        <Input
          sx={{ width: 42 }}
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step,
            min,
            max,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
      </Grid>
    </Grid>
  );
}

export default SliderComponent;