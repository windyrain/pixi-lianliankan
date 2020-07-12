export default class Eliminate {
  static arr: Array<Array<number | undefined>>;

  static isBlocked = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
    if (x === x1 && y === y1) return false;
    if (x === x2 && y === y2) return false;

    return typeof Eliminate.arr[y][x] !== "undefined";
  }

  static remove = (x1:number, y1:number, x2:number, y2:number) => {
    const { arr } = Eliminate;

    if (arr[y1][x1] !== arr[y2][x2]) return false;

    if (Eliminate.horizon(x1, y1, x2, y2)) return true;
    if (Eliminate.vertical(x1, y1, x2, y2)) return true;
    if (Eliminate.turn_once(x1, y1, x2, y2)) return true;
    if (Eliminate.turn_twice(x1, y1, x2, y2)) return true;

    return false;
  }

  static horizon = (x1:number, y1:number, x2:number, y2:number) => {
    if (x1 === x2 && y1 === y2) {
      return false;
    }

    if (y1 !== y2) {
        return false;
    }

    const startX = Math.min(x1, x2)
    const endX = Math.max(x1, x2);

    let flag = true;

    for (let i= startX; i < endX; i++) {
        if (Eliminate.isBlocked(i, y1, x1, y1, x2, y2)) {
            flag = false;
            break;
        }
    }

    return flag;
  }

  static vertical = (x1:number, y1:number, x2:number, y2:number) => {
    if (x1 === x2 && y1 === y2) {
      return false;
    }

    if (x1 !== x2) {
        return false;
    }

    const startY = Math.min(y1, y2)
    const endY = Math.max(y1, y2);
    let flag = true;

    for (let j= startY; j < endY; j++) {
        if (Eliminate.isBlocked(x1, j, x1, y1, x2, y2)) {
            flag = false;
            break;
        }
    }

    return flag;
  }

  static turn_once(x1:number, y1:number, x2:number, y2:number) {
    if (x1 == x2 && y1 == y2) {
        return false;
    }
 
    let c_x = x1, c_y = y2;
    let d_x = x2, d_y = y1;
 
    let ret = false;
    if (!Eliminate.isBlocked(c_x, c_y, x1, y1, x2, y2)) {
        ret = Eliminate.horizon(x1, y1, c_x, c_y) && Eliminate.vertical(c_x, c_y, x2, y2);

        if (!ret) {
          ret = Eliminate.vertical(x1, y1, c_x, c_y) && Eliminate.horizon(c_x, c_y, x2, y2);
        }
    }
 
    if (!ret && !Eliminate.isBlocked(d_x, d_y, x1, y1, x2, y2)) {
        ret = Eliminate.horizon(x1, y1, d_x, d_y) && Eliminate.vertical(d_x, d_y, x2, y2);

        if (!ret) {
          ret = Eliminate.vertical(x1, y1, d_x, d_y) && Eliminate.horizon(d_x, d_y, x2, y2);
        }
    }

    if (ret) {
        return true;
    }
 
    return false;
  }

  static turn_twice(x1:number, y1:number, x2:number, y2:number) {
    if (x1 == x2 && y1 == y2) {
        return false;
    }
 
    for (let i = 0; i < Eliminate.arr[0].length; i++)
    {
        for (let j = 0; j < Eliminate.arr.length; j++)
        {
            if (i != x1 && i != x2 && j != y1 && j != y2)
            {
                continue;
            }
 
            if ((i == x1 && j == y1) || (i == x2 && j == y2))
            {
                continue;
            }
 
            if (Eliminate.isBlocked(i, j, x1, y1, x2, y2))
            {
                continue;
            }
 
            if (Eliminate.turn_once(x1, y1, i, j) && (Eliminate.horizon(i, j, x2, y2) || Eliminate.vertical(i, j, x2, y2)))
            {
                return true;
            }
            if (Eliminate.turn_once(i, j, x2, y2) && (Eliminate.horizon(x1, y1, i, j) || Eliminate.vertical(x1, y1, i, j)))
            {
                return true;
            }
 
        }
    }
 
    return false;
  }
}