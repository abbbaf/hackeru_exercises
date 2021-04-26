const _ = require("lodash");
const { Flight, validate } = require("../models/flights");
const router = require("../router")();


router.get('/all',async (_,res) => {
  const flights = await Flight.find({},{ _id: 0, __v: 0  })
  if (!flights.length) res.notFound("Flights database is empty.")
  else res.send(flights)
})

router.get('/destination/:id', async (req, res) => {
  if (validate({ destination: req.params.id})) 
    return res.badRequest("Invalid destination.")
  const flights = await Flight.find({ destination: req.params.id }, { _id: 0 })
  if (!flights.length) res.notFound("No flights found for this destination.")
  else res.send(flights)
})

router.get('/takeoff_date/:id', async (req, res) => {
  if (validate({ takeoff_date: req.params.id})) 
    return res.badRequest("Invalid date format.")
  const flights = await Flight.find({ takeoff_date: req.params.id }, { _id: 0 })
  if (!flights.length) res.notFound("No flights found on this date.")
  else res.send(flights)
})


router.get('/flight_number/:id', async (req, res) => {
  if (validate({ flight_number: req.params.id})) 
    return res.badRequest("Invalid flight number.")
  const flight = await Flight.findOne({ flight_number: req.params.id }, { _id: 0 })
  if (!flight) res.notFound("No flights with this flight number.")
  else res.send(flight)
})

router.put('/update',async (req, res) => {
  console.log(req.body)
  const error = validate(req.body, true)
  if (error) return res.badRequest(error)
  if (await Flight.findOne({flight_number: req.body.flight_number}))
    return res.badRequest("Flight number already exist.")
  console.log('aaaa')
  const flight = new Flight(
    _.pick(req.body, ["flight_number", "destination", "takeoff_date" ])
  )
  await flight.save()
  res.send("Flight details was added successfully.")
})


module.exports = router;

