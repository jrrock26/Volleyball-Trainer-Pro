import AsyncStorage from "@react-native-async-storage/async-storage";
import { HitRecord } from "../types/hit";

const KEY = "HIT_RECORDS_V2";

export async function saveHit(hit: HitRecord) {
  const existing: HitRecord[] = JSON.parse((await AsyncStorage.getItem(KEY)) || "[]");
  existing.push(hit);
  await AsyncStorage.setItem(KEY, JSON.stringify(existing));
}

export async function getHits(): Promise<HitRecord[]> {
  return JSON.parse((await AsyncStorage.getItem(KEY)) || "[]");
}

