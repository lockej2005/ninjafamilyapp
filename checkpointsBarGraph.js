import React from 'react';
import { View } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';

const CheckpointsBarGraph = ({ score }) => {
    return (
        <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
            <BarChart
                style={{ flex: 1 }}
                data={[score]}
                horizontal={true}
                svg={{ fill: 'rgba(127, 50, 168, 0.8)' }}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={100}
            >
                <Grid direction={Grid.Direction.VERTICAL} />
            </BarChart>
        </View>
    );
};

export default CheckpointsBarGraph;
