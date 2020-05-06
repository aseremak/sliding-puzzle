const DBG = false;

class PuzzleArray {
    constructor(size, pieceWidth) {
      this.field = this.createArray(size);  // ARRAY OF NUMBERS FROM 1 TO size*size-1
      // EX. size=3
      // [[null, null, null, null],
      //  [null, 1,    2,    3],
      //  [null, 4,    5,    6],
      //  [null, 7,    8,    null]]
      // FIRST COLUMN AND ROW WON'T BE USED AT ALL     
      this.size = size;
      this.pieceSize = pieceWidth;
      this.DBG = DBG;
      this.DBG && console.log('[PuzzleArray.constructor]');
    };

    createArray(size) {
      const arr = [];
      let i = 0;
      for(let y=0; y<=size; y++){
        let newRow = []
        for(let x=0; x<=size; x++){
          if ((x && y) && (x!==size || y!==size)) {
            newRow.push(++i);
          } else {
            newRow.push(null);
          }
        };
        arr.push(newRow);
      }
      return arr;
    }

    setPieceSize(newSize) {
      this.pieceSize = newSize
    }

    disorderRatio() {
      // RETURNS NUMBER OF PIECES ON ITS PLACES DIVIDED BY NUMBER OF PIECES
      // 1 MEANS PUZZLE IS SOLVED, 0 MEANS ANY PIECE IS IN ITS PLACE
      let piecesInPlace = 0,
        id = 1;

      for(let y=1; y<=this.size; y++){
        for(let x=1; x<=this.size; x++){
          if(id < this.size**2) {
            const {column, row} = this.findColumnAndRow(this.field, id++);
            if (column===x && row===y) {
              piecesInPlace++              
      }}}}

      return piecesInPlace / ((this.size**2) - 1);
    };    

    shuffle(count) {
      // MOVES RANDOM PUZZLE AT LEAST count TIMES
      // AND UNTIL 15% PUZZLE PIECES WILL BE NOT IN CORRECT PLACE
      count = (count === undefined) ? 10000: count;
      do {
        for(let i=1; i<=count; i++){
          let id = Math.ceil( Math.random()*((this.size**2 - 1)) );
          this.movePiece(id);  
        };
      } while (this.disorderRatio() > 0.9); // 0.15);
      // console.dir(this.field);
      // console.dir(this.originalArray);
    };

    findColumnAndRow = (arr, id) => {
      
      // RETURNS {column, row} OF PIECE FOR GIVEN id IN arr ARRAY.
      for(let y=1; y<=this.size; y++){
        for(let x=1; x<=this.size; x++){
          if (arr[y][x] === id) {
            return {column: x, row: y}
    }}}};  
  
    calculatePosition = (arr, id) => {
      // RETURNS POSITION {top, left} OF PIECE FOR GIVEN id IN arr ARRAY.
      let top, left;
      const {column, row} = this.findColumnAndRow(arr, id);
      top = this.pieceSize * (row - 1);
      left = this.pieceSize * (column - 1);
      return {top: top, left: left};
    };
  
    positionsArray() {
      // RETURNS ARRAY OF POSITIONS {top, left} FOR EACH PUZZLES
      let result = [null];
      for(let i=1; i<this.size**2; i++){
        result.push(this.calculatePosition(this.field, i))
      }; 
      return result;
    };

    originalPositionsArray() {
      // RETURNS ARRAY OF POSITIONS {top, left} FOR EACH PUZZLES IN CORRECT ORDER
      const originalArray = this.createArray(this.size); // ARRAY IN STARTING ORDER
      let result = [null];
      for(let i=1; i<this.size**2; i++){
        result.push(this.calculatePosition(originalArray, i))
      }; 
      return result;
    };

    movePiece = (id) => {
      // MOVES PIECE FOR id TO EMPTY PLACE
      // RETURN FALSE IF MOVEMENT WAS IMPOSSIBLE
      const {column, row} = this.findColumnAndRow(this.field, id),
        field = [...this.field];

      // TRY MOVE RIGHT
      if ( column !== this.size && field[row][column+1] === null ) {
        this.field[row][column+1] = id;
        this.field[row][column] = null;
      } 
      // TRY MOVE LEFT
      else if (column !== 1 && field[row][column-1] === null) {
        this.field[row][column-1] = id;
        this.field[row][column] = null;
      }
      // TRY MOVE UP
      else if (row !== 1 && field[row-1][column] === null) {
        this.field[row-1][column] = id;
        this.field[row][column] = null;
      }
      // TRY MOVE DOWN
      else if (row !== this.size && field[row+1][column] === null) {
        this.field[row+1][column] = id;
        this.field[row][column] = null;
      }
      // NO MOVES
      else {
        return false;
      }
      return true;
    };

  }

export default PuzzleArray;