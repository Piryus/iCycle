import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    divider: {
        height: 28,
        margin: 4,
    }
});


class SlotPicker extends React.Component {
    render() {
        const {classes, value, handleSlotSelection} = this.props;
        return (
            <FormControl className={this.props.className} variant="outlined" fullWidth>
                <InputLabel htmlFor="slot-picker">Slots</InputLabel>
                <OutlinedInput
                    id="slot-picker"
                    value={value}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconButton
                                aria-label="Decrement slot"
                                onClick={() => {
                                    if (value > 1)
                                        handleSlotSelection(value - 1)
                                }}
                                edge="start"
                            >
                                <RemoveIcon/>
                            </IconButton>
                            <Divider className={classes.divider} orientation="vertical"/>
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <Divider className={classes.divider} orientation="vertical"/>
                            <IconButton
                                aria-label="Increment slot"
                                onClick={() => handleSlotSelection(value + 1)}
                                edge="end"
                            >
                                <AddIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                    labelWidth={38}
                />
            </FormControl>
        );
    }
}

export default withStyles(styles)(SlotPicker);