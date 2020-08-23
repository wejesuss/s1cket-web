export function waitTwoMinutes() {
  const twoMinutes = 120000;
  const twoMinutesWaited =
    Date.now() > Number(localStorage.getItem('last')) + twoMinutes;

  return twoMinutesWaited;
}
