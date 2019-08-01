const Chance = require('chance')
const Client = require('../models/Client')
const Account = require('../models/Account')

// Instantiate Chance so it can be used
const chance = new Chance()

const currencies = ['GEL', 'USD', 'EUR', 'RUB']

module.exports = {
  seed (cb) {
    const _docs = []

    const n50to99 = chance.natural({ min: 50, max: 99 })

    for (let i = 0; i < n50to99; i++) {
      _docs.push({
        pid: chance.natural({ min: 10000000000, max: 99999999999 }),
        firstName: chance.first(),
        lastName: chance.last(),
        gender: chance.gender().substr(0, 1),
        phoneNumber: chance.phone({ formatted: false }),
        address: {
          legal: {
            country: chance.country({ full: true }),
            city: chance.city(),
            address: chance.address()
          },
          physical: {
            country: chance.country({ full: true }),
            city: chance.city(),
            address: chance.address()
          }
        }
      })
    }

    Client.deleteMany().then(() => {
      Client.insertMany(_docs).then((docs) => {
        const _docs = []

        docs.forEach((doc) => {
          const n1to5 = chance.natural({ min: 1, max: 5 })

          for (let i = 0; i < n1to5; i++) {
            const n1to3 = chance.natural({ min: 1, max: 3 })
            const n0to3 = chance.natural({ min: 0, max: 3 })

            _docs.push({
              client: doc._id,
              type: n1to3,
              currency: currencies[n0to3]
            })
          }
        })

        Account.deleteMany().then(() => {
          Account.insertMany(_docs)
        })
      })
    })
  }
}
