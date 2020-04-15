class PuzzleArray {
    constructor(size) {
      this.field = [];
      this.size = size;
      this.pieceSize = 100;
      // ARRAY OF NUMBERS FROM 1 TO size*size-1
      // EX. size=3
      // [[null, null, null, null],
      //  [null, 1,    2,    3],
      //  [null, 4,    5,    6],
      //  [null, 7,    8,    null]]
      // FIRST COLUMN AND ROW WON'T BE USED AT ALL
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
        this.field.push(newRow);
      };
    } 

    disorderRatio() {
      // RETURNS NUMBER OF PIECES ON ITS PLACES DIVIDED BY NUMBER OF PIECES
      // 1 MEANS PUZZLE IS SOLVED, 0 MEANS ANY PIECE IS IN ITS PLACE
      let piecesInPlace = 0,
        id = 1;

      for(let y=1; y<=this.size; y++){
        for(let x=1; x<=this.size; x++){
          if(id < this.size**2) {
            const {column, row} = this.findColumnAndRow(id++);
            if (column===x && row===y) {
              piecesInPlace++              
      }}}}

      return piecesInPlace / ((this.size**2) - 1);
    };    

    shuffle() {
      // SHUFFLES PUZZLE
      let id = Math.ceil( Math.random()*((this.size**2 - 1)) );
      this.movePiece(id);
      // RECURSION UNTIL 15% PUZZLE WILL BE NOT IN CORRECT PLACE
      if(this.disorderRatio() > 0.15) {
        this.shuffle();
      };
    };

    findColumnAndRow = (id) => {
      // RETURNS {column, row} OF PIECE FOR GIVEN id.
      for(let y=1; y<=this.size; y++){
        for(let x=1; x<=this.size; x++){
          if (this.field[y][x] === id) {
            return {column: x, row: y}
    }}}};  
  
    calculatePosition = (id) => {
      // RETURNS POSITION {top, left} OF PIECE FOR GIVEN id.
      let top, left;
      const {column, row} = this.findColumnAndRow(id);
      top = this.pieceSize * (row - 1);
      left = this.pieceSize * (column - 1);
      return {top: top, left: left};
    };
  
    positionsArray() {
      // RETURNS ARRAY OF POSITIONS {top, left} FOR EACH PUZZLES
      let arr = [null];
      for(let i=1; i<this.size**2; i++){
        arr.push(this.calculatePosition(i))
      }; 
    //   console.log(arr);
      return arr;
    };

    movePiece = (id) => {
      // MOVES PIECE FOR id TO EMPTY PLACE
      // RETURN FALSE IF MOVEMENT WAS IMPOSSIBLE
      const {column, row} = this.findColumnAndRow(id),
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