/**
 * Press Enter every step
 */

const prompt = require('prompt-sync')({sigint: true});
class TreasureHunt {
  constructor(){
    this.foundCorrectNumber = false;
    this.probable = []
    this.fixGrid = [
      ['#','#','#','#','#','#','#','#'],
      ['#','.','.','.','.','.','.','#'],
      ['#','.','#','#','#','.','.','#'],
      ['#','.','.','.','#','.','#','#'],
      ['#','x','#','.','.','.','.','#'],
      ['#','#','#','#','#','#','#','#'],
    ]
    this.theTreasure = null
    this.startingPosition = null
    this.clearPath = []
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  findWay() {
    this.formatValue()
    const { clearPath,  theTreasure } = this
    
    let { startingPosition, foundCorrectNumber } = this
    while (!foundCorrectNumber) {
      let yourMove = prompt('a ↑: b →: c ↓: d ← = ');
      let step = 0
      let keepPosition = startingPosition
    
      switch (yourMove.toLocaleLowerCase()) {
        case 'a':
          step = clearPath.indexOf(startingPosition - 8) < 0 ? keepPosition : (startingPosition - 8)
          break;
        case 'b':
          step = clearPath.indexOf(startingPosition + 1)  < 0 ? keepPosition : (startingPosition + 1)
          break;
        case 'c':
          step = clearPath.indexOf(startingPosition + 8) < 0 ? keepPosition : (startingPosition + 8)
          break;
        case 'd':
          step = clearPath.indexOf(startingPosition - 1) < 0 ? keepPosition : (startingPosition - 1)
          break;
        default:
          step = keepPosition
      }
      keepPosition = step
      startingPosition = step
      if (startingPosition === theTreasure) {
        foundCorrectNumber = true;
        console.log('Congrats, you find the treasure!')
      } 
    
    }
  }

  formatValue (){
    const { fixGrid, probable, clearPath } = this
    fixGrid.forEach((key, index) => {
      key.forEach((keyChild, indexChild) => {
        if(keyChild === '.' || keyChild === '$'){
          probable.push([index, indexChild])
          clearPath.push((key.length * index) + (indexChild + 1))
        }
    
        if(keyChild === 'x'){
          this.startingPosition = (key.length * index) + (indexChild + 1)
        }
    
        if(keyChild === '$'){
          this.theTreasure = (key.length * index) + (indexChild + 1)
        }
      })
    })
    const newRandom = new Array(3).fill('')
    const arr = newRandom.map((key) => probable[this.getRandomInt(probable.length)])
    const putTheTreasure = arr[this.getRandomInt(arr.length)]
    this.theTreasure = (fixGrid[putTheTreasure[0]].length * (putTheTreasure[0])) + (putTheTreasure[1] + 1) 
    arr.forEach(key => {
      fixGrid[key[0]][key[1]] = '$'
    })
    fixGrid.forEach(key => console.log(key.join('').toString()))
  }
  
}

const run = new TreasureHunt();
run.findWay()