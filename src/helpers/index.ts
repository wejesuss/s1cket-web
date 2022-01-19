export function waitTwoMinutes(): boolean {
  return true;
  // const twoMinutes = 120000;
  // const twoMinutesWaited =
  //  Date.now() > Number(localStorage.getItem('last')) + twoMinutes;

  // return twoMinutesWaited;
}

export function getFavoriteQueryParam(params: string): string {
  const paramsWithoutQuestionMark = params.slice(1);
  const arrayOfParams = paramsWithoutQuestionMark.split('&');

  const searchParamIndex = arrayOfParams.findIndex(
    (param) => param.slice(0, 6) === 'search',
  );
  let param = 'stocks';

  if (searchParamIndex !== -1) {
    [, param] = arrayOfParams[searchParamIndex].split('=');
  }

  return param;
}
