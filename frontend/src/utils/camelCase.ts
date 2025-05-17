export function camelToSentence(camelCaseStr: string) {
    return camelCaseStr
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}