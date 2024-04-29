const {
  timerStatus,
  estimatePrepTime,
  calculateQuantities,
  improveRecipe
} = require('../../src/extensions/extensions.js')

describe('timerStatus', () => {
  it("should return Phil's cake is ready! for 0", () => {
    expect(timerStatus(0)).toEqual("Phil's cake is ready!")
  })

  it('should return The cake is still baking! for any other number', () => {
    expect(timerStatus(1)).toEqual('The cake is still baking!')
    expect(timerStatus(15)).toEqual('The cake is still baking!')
    expect(timerStatus(50)).toEqual('The cake is still baking!')
  })

  it("should return You didn't set a timer! for no value provided", () => {
    expect(timerStatus()).toEqual("You didn't set a timer!")
  })
})

describe('estimatePrepTime', () => {
  it('should return 5 for 5 ingredients and 1', () => {
    expect(
      estimatePrepTime(['milk', 'sugar', 'eggs', 'flour', 'chocolate'], 1)
    ).toEqual(5)
  })

  it('should return 10 for 5 ingredients and 2', () => {
    expect(
      estimatePrepTime(['milk', 'sugar', 'eggs', 'flour', 'chocolate'], 2)
    ).toEqual(10)
  })

  it('should return 10 for 5 ingredients and nothing', () => {
    expect(
      estimatePrepTime(['milk', 'sugar', 'eggs', 'flour', 'chocolate'])
    ).toEqual(10)
  })

  it('should return 20 for 2 ingredients and 10', () => {
    expect(estimatePrepTime(['milk', 'sugar'], 10)).toEqual(20)
  })
})

describe('calculateQuantities', () => {
  it('should return sugar: 300 and eggs: 6 for 3 layers', () => {
    expect(calculateQuantities(['milk', 'sugar', 'eggs'], 3)).toEqual({
      sugar: 300,
      eggs: 6
    })
  })

  it('should return sugar: 0 and eggs: 4 for 2 layers with no sugar ingredient', () => {
    expect(calculateQuantities(['milk', 'eggs'], 2)).toEqual({
      sugar: 0,
      eggs: 4
    })
  })

  it('should return sugar: 200 and eggs: 0 for 2 layers with no eggs ingredient', () => {
    expect(calculateQuantities(['milk', 'sugar'], 2)).toEqual({
      sugar: 200,
      eggs: 0
    })
  })
})

describe('improveRecipe', () => {
  it('should scale a recipe for 2 portions', () => {
    expect(improveRecipe({ sugar: 200, eggs: 2, milk: 100 }, 2)).toEqual({
      sugar: 400,
      eggs: 4,
      milk: 200
    })
  })

  it('should scale a recipe for 3 portions', () => {
    expect(improveRecipe({ sugar: 100, eggs: 3, flour: 200 }, 3)).toEqual({
      sugar: 300,
      eggs: 9,
      flour: 600
    })
  })

  it('should not scale a recipe for 1 portion', () => {
    expect(improveRecipe({ sugar: 100, eggs: 3, flour: 200 }, 1)).toEqual({
      sugar: 100,
      eggs: 3,
      flour: 200
    })
  })
})
