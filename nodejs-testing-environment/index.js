function one() {
  console.log("one");
}
function two() {
  console.log("two");
}
function three() {
  console.log("three");
}

function* execute() {
  for (const fn of [one, two, three]) {
    fn();
    yield;
  }
}

const g = execute();
g.next();
