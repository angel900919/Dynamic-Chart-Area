import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    AreaSeries,
    Title,
    Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { styled } from '@mui/material/styles';
import { ArgumentScale, Animation } from '@devexpress/dx-react-chart';
import {
    curveCatmullRom,
    area,
} from 'd3-shape';
import { scalePoint } from 'd3-scale';

const chartData = [
    { dateTime: 'Jan', valueWatts: 101},
];
const PREFIX = 'Demo';

const classes = {
    chart: `${PREFIX}-chart`,
};
const Root = props => (
    <Legend.Root {...props} sx={{ display: 'flex', margin: 'auto', flexDirection: 'row' }} />
);
const Label = props => (
    <Legend.Label {...props} sx={{ whiteSpace: 'nowrap' }} />
);
const StyledChart = styled(Chart)(() => ({
    [`&.${classes.chart}`]: {
        paddingRight: '20px',
    },
}));

const Area = props => (
    <AreaSeries.Path
        {...props}
        path={area()
            .x(({ arg }) => arg)
            .y1(({ val }) => val)
            .y0(({ startVal }) => startVal)
            .curve(curveCatmullRom)}
    />
);

let variable = 0

export default function Processing(){

    const [newData, updateData] = React.useState(chartData)
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


    setTimeout(()=>{

        updateData((
            prevData)=> {
            let newData =[]
            if (prevData.length > 5){

                newData= [...prevData, { dateTime: time, valueWatts: 112+variable*10}]
                newData.shift()

            }
            else{
                newData= [...prevData, { dateTime: time, valueWatts: 112+variable*10}]
            }

                return(newData)
            }
        )

    },1000)

    return(
        <Paper>
            <StyledChart
                data={newData}
                className={classes.chart}
            >
                <ArgumentScale factory={scalePoint} />
                <ArgumentAxis />
                <ValueAxis />

                <AreaSeries
                    name="Active Power"
                    valueField="valueWatts"
                    argumentField="dateTime"
                    seriesComponent={Area}
                />
                <Animation />
                <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                <Title text="Power Consumption (W)" />
            </StyledChart>
        </Paper>
    )


}