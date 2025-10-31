// Fonction pour récupérer les UIDs depuis l'API backend
export const fetchPlayers = async (): Promise<{ value: string }[]> => {
  try {
    const response = await fetch('/api/uids');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des UIDs');
    }
    const data = await response.json();
    const allUids = [data.myUid, ...data.othersUids].filter(Boolean);
    return allUids.map((value: string) => ({ value }));
  } catch (error) {
    console.error('Erreur lors du chargement des players:', error);
    return [];
  }
};

export const players: { value: string }[] = [];
