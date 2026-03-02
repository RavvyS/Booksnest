
//  Generates dynamic test data for Artillery performance scenarios.

function setUniqueUser(context, events, done) {
  const stamp = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  context.vars.name = `Perf User ${stamp}`;
  context.vars.email = `perf-${stamp}@example.com`;
  context.vars.password = "PerfPass123!";
  done();
}

module.exports = {
  setUniqueUser,
};
