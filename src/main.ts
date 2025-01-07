import { app } from "./app/service"

app.listen(process.env.SERVICE_PORT, () => {
    console.log(`Listening on port ${process.env.SERVICE_PORT}`)
})