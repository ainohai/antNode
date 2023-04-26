import { createSimulation, setVariableParams } from '@ainohai/antColony';
import { ConfigType, ParametersType, SimulationStatistics } from '@ainohai/antColony/lib/cjs/types/types';


export const staticParameters: Partial<ParametersType> = {
    COLUMNS: 500,
    ROWS: 500,
}

//Add asynchronity later?
export const runSimulation = (id: number, times: number, config: Partial<ConfigType>, maxLoops: number): { id: number, points: number[] } => {

    let pointsArr: number[] = [];

    for (let i = 0; i < times; i++) {
        let antConfig = {...{
            antLifespan: 10000,
            sight: 10,
            foodPheremoneDecay: 0.005,
            homePheremoneDecay: 0.001,
            antAnarchyRandomPercentage: 0.001, //chance not to move where you should
            moveForwardPercentage: 0.5, // When seeking food. Ants are this likely to just move forward, otherwise they will select random 
            antFoodPheremoneDecay: 0.007,
            antHomePheremoneDecay: 0.002,
            antFoodPheremoneWeight: 10,
            antHomePheremoneWeight: 20,
            goodFoodScoreTreshold: 0.004,
            goodHomeScoreTreshold: 0.2,
            maxPheremone: 100
        }, config}
        setVariableParams(antConfig);
        let sim = createSimulation({ COLUMNS: staticParameters.COLUMNS, ROWS: staticParameters.ROWS });
        let oldState = sim.getState().statistics;    
        let points = 0;
        let wasDone = false;
        for (let i = 0; i < maxLoops; i++) {
            let state = sim.run();
            const statistics = {...state.statistics}

            points = points + calculate(oldState, statistics, i);
            //console.log(points)
            oldState = statistics;

            if (oldState.foodsInNest === oldState.totalFoods) {
                wasDone = true;
                console.log("was done on round: " + i)
               break;
            }
        }

        //Big penalty for not getting all in the nest on time. 
        const penalty = !wasDone ? (oldState.totalFoods - oldState.foodsInNest) * maxLoops * 3 : 0
        console.log(`Was done ${wasDone}, penalty: ${penalty}, pointsWoPen: ${points}, foods nested ${oldState.foodsInNest}, foods picked ${oldState.foodsPicked}, total foods ${oldState.totalFoods}`)
        pointsArr.push(points + penalty);
    }
    return { id: id, points: pointsArr };

}

//The faster, the smaller points
const calculate = (oldState: SimulationStatistics, newState: SimulationStatistics, tick: number): number => {

    const picked = newState.foodsPicked - oldState.foodsPicked;
    const nested = newState.foodsInNest - oldState.foodsInNest;
    return (picked * tick) + (nested * tick * 2);
}
