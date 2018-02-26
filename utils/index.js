export function retryOnce(func, recoverFunc){
  return func()
    .catch( err => {
      console.log('failed, trying recovery once...')
      return recoverFunc(err).then(() => func())
    })
}