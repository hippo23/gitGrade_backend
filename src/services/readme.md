## The services are the main core of the application. Controllers are there for SEPARABLE LOGIC, but any logic that needs to be undone
## if something fails should go in a single service. 

- For some use cases where you want separable logic that has no need to rollback, retrieving data is inconsequential, and you can use
some services for that without needing to create a workflow for the entire thing.