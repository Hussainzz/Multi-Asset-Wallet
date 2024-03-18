export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


export function sleepWithCall(ms: number, callback: () => void): Promise<void> {
    const warnAt = ms / 2
    const warningTimer  = setInterval(callback, warnAt);
    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(warningTimer);
        resolve()
      }, ms);
    });
  }
  