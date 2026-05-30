import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedHit = {
  id: string;
  timestamp: number;
  videoUri: string;
};

const KEY = "saved_hits_v1";

export async function getSavedHits(): Promise<SavedHit[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedHit[];
  } catch {
    return [];
  }
}

export async function saveHit(videoUri: string): Promise<void> {
  const hits = await getSavedHits();
  const newHit: SavedHit = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    videoUri,
  };
  const updated = [newHit, ...hits];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function deleteHit(id: string): Promise<void> {
  const hits = await getSavedHits();
  const filtered = hits.filter((h) => h.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}
