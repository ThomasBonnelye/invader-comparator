export interface PlayerData {
  player: string
  invaders: string[]
}

export async function fetchPlayerData(uid: string): Promise<PlayerData> {
  const BASE_URL = 'https://api.space-invaders.com/flashinvaders_v3_pas_trop_predictif/api/gallery?uid='

  try {
    const response = await fetch(`${BASE_URL}${uid}`)
    const data = await response.json()

    const player = data?.player?.name || uid
    const invadersRaw = Object.values(data?.invaders || {})
    const invaderNames = [...new Set(invadersRaw.map((inv: any) => (inv?.name ?? '').toString().trim()))]

    return {
      player,
      invaders: invaderNames
    }
  } catch (error) {
    console.error(`Erreur lors du fetch des données pour UID ${uid}:`, error)
    return {
      player: uid,
      invaders: []
    }
  }
}
