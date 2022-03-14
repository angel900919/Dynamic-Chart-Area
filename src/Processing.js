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

let todayAux = new Date();
let timeAux = todayAux.getHours() + ":" + todayAux.getMinutes() + ":" + todayAux.getSeconds()

let chartData = [{dateTime:timeAux, valueWatts:1.5}];
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

let power = 0

export default function Processing(){

    const [newData, updateData] = React.useState(chartData)
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    React.useEffect(
        () => {
            async function getData() {
                const res = await fetch("http://192.168.0.146/emeter/0")
                const data = await res.json()
                power = data.power
                //setStarWarsData(data.emeters[0])
            }
            getData()
        }, [time])



    setTimeout(()=>{
        updateData((
            prevData)=> {
            //remove first element to make the chart to move dynamically
            console.log([...prevData, { dateTime: time, valueWatts: power}])
            return(prevData.length > 15 ? [...prevData, { dateTime: time, valueWatts: power}].slice(1):[...prevData, { dateTime: time, valueWatts: power}])

            }
        )

    },500)

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