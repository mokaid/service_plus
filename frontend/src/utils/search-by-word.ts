export function searchByWord(searchTerm: string, str: string) {
  const re = new RegExp(`\\b${searchTerm}`, "i");

  return re.test(str);
}
