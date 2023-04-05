import {createSimulation} from '@ainohai/antColony';
import { configType, ParametersType, SimulationStatistics } from '@ainohai/antColony/lib/cjs/types/types';

const MAX_LOOPS = 10000;
let points = 0;

export const staticParameters: Readonly<ParametersType> = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_ANTS: 700,
}


export const antConfig: configType = {
    antLifespan: 10000,
    sight: 10,
    foodPheremoneDecay: 0.2, //max 1
    homePheremoneDecay: 0.2, //max 1
    moveRandomPercentage: 0.1,
    moveForwardPercentage: 0.1,
    foodDistanceFactor: 1,
    homeDistanceFactor: 1,
}

export const runSimulation = (): number => {
    let sim = createSimulation({COLUMNS: staticParameters.COLUMNS, ROWS: staticParameters.ROWS});
    let oldState = sim.getState().statistics;

    for (let i = 0; i < MAX_LOOPS; i++) {
        let state = sim.run();

        points += calculate(oldState, state.statistics, i);
        oldState = state.statistics;

        if (state.world.getFoodCoordinates().length === 0) {
            return points;
        }
    }

    //Big penalty for not getting all in the nest on time. 
    return points + (oldState.totalFoods - oldState.foodsInNest) * MAX_LOOPS * 100;

}

//The faster, the smaller points
const calculate = (oldState: SimulationStatistics, newState: SimulationStatistics, tick: number): number => {

    const picked = newState.foodsPicked - oldState.foodsPicked;
    const nested = newState.foodsInNest - oldState.foodsInNest;
    return (picked * tick) + (nested * tick * 2);
}
