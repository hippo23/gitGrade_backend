export type StepFunction<TInput, TOutput> = (input: TInput) => Promise<TOutput>
export type CompensationFunction<TInput, TOutput> = (input: TInput, output: TOutput) => Promise<void>
export type StepProxy<TInput, TOutput> = {
    (
    execute: StepFunction<TInput, TOutput>
    ): (input: TInput) => Promise<TOutput>

    compensate: (
        execute: StepFunction<TInput, TOutput>,
        options: { compensate?: CompensationFunction<TInput, TOutput> }
    ) => (input: TInput) => Promise<TOutput>;
}