import EncryptedStorage from 'react-native-encrypted-storage';

export async function getAsyncDataByKey(keyName: string) {
  return EncryptedStorage.getItem(keyName);
}

export async function setAsyncData(keyName: string, value: string) {
  await EncryptedStorage.setItem(keyName, value);
}


export async function logout() {
  await EncryptedStorage.clear();
}