export const INFO_FETCHED = 'INFO_FETCHED';

export function loadInfo(results) {
  return {
    type : INFO_FETCHED,
    payload : results
  }
}
