export async function createInterstitialAd(adUnitId: string) {
  try {
    const interstitialAd = uni.createInterstitialAd({ adUnitId })
    await interstitialAd.load()
    return interstitialAd
  } catch (error) {
    return null
  }
}
