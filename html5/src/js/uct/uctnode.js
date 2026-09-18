//
// Copyright (c) 2016, 2026 Oliver Merkel. MIT License.
//

export class UctNode {
  constructor(parentNode, board, action) {
    this.verbose = false;
    this.action = action;
    this.parentNode = parentNode;
    this.children = [];
    this.wins = 0;
    this.visits = 0;
    this.unexamined = board.getActions();
    this.activePlayer = board.active;
  }

  addChild(board, index) {
    const node = new UctNode(this, board, this.unexamined[index]);
    this.unexamined.splice(index, 1);
    this.children.push(node);
    return node;
  }

  selectChild() {
    return (
      this.children.reduce((best, child) => {
        const uctValue =
          child.wins / child.visits + Math.sqrt((2 * Math.log(this.visits)) / child.visits);
        return best === null || uctValue > best.value ? { child, value: uctValue } : best;
      }, null)?.child ?? null
    );
  }

  update(result) {
    this.visits += 1;
    this.wins += result[this.activePlayer];
  }

  mostVisitedChild() {
    if (this.verbose) {
      for (const child of this.children) {
        console.log(`${child.action} (${child.wins.toFixed(2)}/${child.visits})`);
      }
    }
    return this.children.reduce(
      (mostVisited, child) =>
        mostVisited === null || child.visits > mostVisited.visits ? child : mostVisited,
      null
    );
  }
}
