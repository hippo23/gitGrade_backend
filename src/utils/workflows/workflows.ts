import { StepFunction, CompensationFunction } from "@src/types/workflows/workflows"
const { winston } = require('winston')

class WorkflowStep<TInput, TOutput> {
    constructor(
        public execute: StepFunction<TInput, TOutput>,
        public compensate?: CompensationFunction<TInput, TOutput>
    ) {}
}

function createWorkflow<TInput, TOutput>(
    name: string,
    builder: (input: TInput) => any
) {
    const steps: WorkflowStep<any, any>[] = []
    const executedSteps: { step: WorkflowStep<any, any>, input: any, output?: any}[] = []

    function stepProxy<TInput, TOutput>(
        execute: StepFunction<TInput, TOutput>
    ): (input: TInput) => Promise<TOutput> {
        const step = new WorkflowStep(execute)
        steps.push(step)

        return async (input: TInput) => {
            try {
                const result = await execute(input)
                executedSteps.push({
                    step, 
                    input,
                    output: result
                })
                return result
            } catch (error) {
                await compensateExecutedSteps()
                throw error
            }
        }
    }

    stepProxy.compensate = function<TInput, TOutput>(
        execute: StepFunction<TInput, TOutput>,
        options: { compensate?: CompensationFunction<TInput, TOutput>}
    ) {
        const step = new WorkflowStep(execute, options.compensate)
        steps.push(step)

        return async (input: TInput) => {
            try {
                const result = await execute(input)
                executedSteps.push({step, input, output: result})
                return result;
            } catch (error) {
                await compensateExecutedSteps()
                throw error
            }
        }
    }

    async function compensateExecutedSteps() {
        for (let i = executedSteps.length - 1; i >= 0; i--) {
            const {step, input, output} = executedSteps[i]
            if (step.compensate) {
                await step.compensate(input, output)
            }
        }
    }

    const workflow = async (input) => {
        try {
            return await builder(stepProxy as any)(input)
        } catch (error) {
            await compensateExecutedSteps()
            throw error
        }
    }

    return {
        run: async (input: TInput) => {
            executedSteps.length = 0
            return workflow(input)
        }
    }
}

export { createWorkflow }